import json
import asyncio
import openai

from config import settings
from schemas import TeaBreakRequest, TeaBreakResponse, TeaBreakEffect

# ===== AI 客户端初始化 =====
client = openai.OpenAI(
    api_key=settings.deepseek_api_key or "placeholder",
    base_url=settings.deepseek_base_url,
)

# ===== 允许的 mood 值（与 game.js 完全一致）=====
ALLOWED_MOODS = {
    "neutral", "warm", "tense", "withdrawn",
    "sad", "happy", "angry", "surprised", "confused"
}

# ===== 回退预设数据（当大模型挂掉时使用）=====
FALLBACK_LINES = {
    "阿缇娅": {
        "A": "声源稳定。你的问题不稳定。若这是闲聊，我需要重新定义闲聊。",
        "B": "机能正常。情绪残响存在波动。你没有把它叫作故障，这一点已记录。",
        "C": "指令收到。但在执行前，说明战略意图。我不接受没有坐标的冲锋。",
        "D": "战略分析中……你的胜率计算缺少了最重要的变量——我。",
        "E": "温度下降，心率平稳。现在没有战斗，也没有别人。你可以……不用一直看着我。"
    },
    "弥洛": {
        "A": "哼。低频共振没有异常。找我什么事？如果又是那些无聊的贵族礼仪，免谈。",
        "B": "我能听到……这下面有什么在震动。别担心，在它冲破防线前，我会先把它砸碎。",
        "C": "战术安排？随你便。只要告诉我把哪里的墙壁轰塌就行了。",
        "D": "防线已部署。如果他们敢过来，就让他们尝尝低频的滋味。至于你……站在我后面。",
        "E": "……有点吵。那些声音。但在这里，只有你的频率是清晰的。"
    },
    "槐序": {
        "A": "嗯？指挥官想聊什么？如果是关于音乐节的企划，我刚好有几个绝妙的主意哦！",
        "B": "啊呀，看你这副表情，是遇到烦心事了吗？来，让我为你演奏一曲轻松的圆舞曲吧！",
        "C": "明白明白~战前动员就交给我吧！我会让大家踩着最完美的节拍上阵的！",
        "D": "局势分析？简单来说就是——只要我们的旋律比他们更响亮，就能赢！对吧？",
        "E": "……其实，一直保持欢快的节奏，也会有稍微觉得累的时候呢。指挥官，能让我靠一下吗？"
    },
    "洛温": {
        "A": "阁下。我的剑与盾皆已准备妥当。有何吩咐？",
        "B": "您的脸色有些疲惫。请务必注意休息。作为您的坚盾，我必须确保您的状态良好。",
        "C": "防线已加固。无论面对何种冲击，我都会如磐石般守护在您身前。这是我的誓言。",
        "D": "敌人的动向尽在掌握。接下来，请下达坚守或是反击的指令，阁下。",
        "E": "……有时候，我也会思考，在这面盾牌之后，我还能为您做些什么。希望这不会显得逾越。"
    },
    "伊芙白": {
        "A": "哎呀，指挥官？这么有空来找我，是想听我弹一曲蓝调，还是……想谈谈心？",
        "B": "你看上去需要放松一下。要不要来杯加了点‘特调’的饮料？放心，不会影响战斗的~",
        "C": "战术嘛，有时候就像即兴演奏，不需要太死板的乐谱。看准时机，随心所欲就好。",
        "D": "对面的家伙看起来挺棘手的。不过别怕，只要节奏掌握在我们手里，一切都会迎刃而解。",
        "E": "……你知道吗？在这个没有色彩的世界里，你是我见过的最有趣的‘变奏’。"
    },
    "明弦": {
        "A": "……何事？如果只是无关紧要的闲聊，不要浪费我的时间。",
        "B": "我的力量，正是为了终结这一切而存在的。如果你感到畏惧，大可远离我。",
        "C": "战术？不需要那种东西。只要把阻挡在前面的敌人全部粉碎，这就足够了。",
        "D": "命运是可以被打破的。只要你的决心足够强大。看着吧，我会证明给你看。",
        "E": "……你为什么不逃走？明明知道靠近我会有什么样的后果。真是个……愚蠢的人。"
    }
}

MUSICART_PROFILES = {
    "槐序": {"codename": "灰圆舞", "concept": "圆舞曲，三拍节律"},
    "洛温": {"codename": "沉低音", "concept": "帕萨卡利亚，固定低音"},
    "阿缇娅": {"codename": "暮星序曲", "concept": "非正规觉醒，黑金指挥契约"},
    "弥洛": {"codename": "低鸣骑士", "concept": "临时律者，固定低频防线"},
    "伊芙白": {"codename": "蓝调改色", "concept": "蓝调，即兴变奏"},
    "明弦": {"codename": "赤命定", "concept": "命运动机，强对比戏剧性"}
}

def get_fallback_response(character: str, context_type: str) -> TeaBreakResponse:
    lines = FALLBACK_LINES.get(character, {})
    dialogue = lines.get(context_type, lines.get("A", "……"))
    return TeaBreakResponse(
        dialogue=dialogue,
        effects=[],
        mood="neutral",
        flagEvent=None,
        fallback=True,
    )

def build_system_prompt(request: TeaBreakRequest) -> str:
    profile = MUSICART_PROFILES.get(request.character)
    if not profile:
        raise ValueError(f"角色配置缺失: {request.character}")

    ctx = request.context
    prompt = f"""
你正在扮演《宿命回响》世界观下的奏者（Musicart）：{request.character}。
代号：{profile["codename"]}
核心概念：{profile["concept"]}

当前环境与状态：
- 语境：{ctx.context_type}
- 当前所处环境：{ctx.chapter_context}
- 奏者对玩家信任度：{ctx.trust}/100
- 奏者对玩家共鸣度：{ctx.resonance}/100
- 奏者心理压力值：{ctx.pressure}/100
- 玩家（指挥家）性别：{ctx.conductor_gender}
- 玩家健康状态：{ctx.conductor_health_tier}
- 最近触发事件：{", ".join(ctx.triggered_events) if ctx.triggered_events else "无"}
- 玩家近期行为记录：{str(ctx.recent_behaviors)}

必须遵守以下人设与剧情规则：
1. 【禁止打破第四面墙】：绝不能提及AI、API、模型、开发者等词汇。
2. 【关系动态变化】：根据当前的信任、共鸣、压力值调整语气。
3. 【禁止替玩家说话】：只输出奏者自己的台词和反应。
4. 【符合世界观】：不要提及现实世界的国家、品牌等。

输出要求：
1. 不要输出任何格式化的代码块或多余解释。
2. 首先流式输出奏者的话语（直接是文本内容，不需要任何标签包裹）。
3. 话语输出完毕后，**必须**输出分隔符 `<<META>>`。
4. 分隔符之后，**必须**输出一个严格的 JSON 对象，包含本次对话对属性的影响。

JSON 格式要求：
{{
  "effects": [
    {{"stat": "{request.character}信任", "delta": 1到3的整数}},
    {{"stat": "{request.character}压力", "delta": -2到2的整数}}
  ],
  "mood": "neutral|warm|tense|withdrawn|sad|happy|angry|surprised|confused",
  "flagEvent": null
}}
"""
    return prompt.strip()

async def stream_chat_with_musicart(request: TeaBreakRequest):
    """
    核心流式函数：调用大模型完成茶歇对话，并返回一个异步生成器。
    用于 StreamingResponse。
    """
    if not settings.deepseek_api_key or settings.deepseek_api_key == "placeholder":
        fallback_resp = get_fallback_response(request.character, request.context.context_type)
        # Yield the exact fallback dialogue directly
        yield f"event: text\ndata: {json.dumps(fallback_resp.dialogue)}\n\n"
        # Yield the empty META info
        meta = {
            "effects": [],
            "mood": fallback_resp.mood,
            "flagEvent": None
        }
        yield f"event: meta\ndata: {json.dumps(meta)}\n\n"
        yield "event: done\ndata: {}\n\n"
        return

    system_prompt = build_system_prompt(request)
    messages = [{"role": "system", "content": system_prompt}]
    for msg in request.conversation_history[-16:]:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": request.player_message})

    try:
        response = client.chat.completions.create(
            model=settings.deepseek_model,
            messages=messages,
            max_tokens=500,
            stream=True,
            timeout=15,
        )

        buffer = ""
        is_meta_stage = False
        meta_buffer = ""

        for chunk in response:
            delta = chunk.choices[0].delta.content or ""
            
            if not is_meta_stage:
                buffer += delta
                if "<<META>>" in buffer:
                    parts = buffer.split("<<META>>", 1)
                    if parts[0]:
                        yield f"event: text\ndata: {json.dumps(parts[0])}\n\n"
                    is_meta_stage = True
                    meta_buffer += parts[1]
                else:
                    if len(buffer) > 8:
                        safe_text = buffer[:-8]
                        buffer = buffer[-8:]
                        yield f"event: text\ndata: {json.dumps(safe_text)}\n\n"
            else:
                meta_buffer += delta
                
        if not is_meta_stage and buffer:
            yield f"event: text\ndata: {json.dumps(buffer)}\n\n"

        meta_data = {
            "effects": [],
            "mood": "neutral",
            "flagEvent": None
        }
        
        if meta_buffer:
            try:
                cleaned_meta = meta_buffer.strip()
                if cleaned_meta.startswith("```"):
                    import re
                    cleaned_meta = re.sub(r"^```(?:json)?\s*|\s*```$", "", cleaned_meta, flags=re.IGNORECASE).strip()
                parsed_meta = json.loads(cleaned_meta)
                if isinstance(parsed_meta.get("effects"), list):
                    meta_data["effects"] = parsed_meta["effects"]
                if parsed_meta.get("mood") in ALLOWED_MOODS:
                    meta_data["mood"] = parsed_meta["mood"]
                meta_data["flagEvent"] = parsed_meta.get("flagEvent")
            except Exception as e:
                print(f"[AI Service] 解析 META JSON 失败: {e}")

        yield f"event: meta\ndata: {json.dumps(meta_data)}\n\n"
        yield "event: done\ndata: {}\n\n"

    except Exception as e:
        print(f"[AI Service] 调用失败: {e}")
        fallback_resp = get_fallback_response(request.character, request.context.context_type)
        yield f"event: text\ndata: {json.dumps(fallback_resp.dialogue)}\n\n"
        meta = {
            "effects": [],
            "mood": fallback_resp.mood,
            "flagEvent": None
        }
        yield f"event: meta\ndata: {json.dumps(meta)}\n\n"
        yield "event: done\ndata: {}\n\n"
