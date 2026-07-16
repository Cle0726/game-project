import os
import subprocess
import sys
import unittest


class SecurityConfigTests(unittest.TestCase):
    def run_python_snippet(self, code: str, **env_overrides: str) -> subprocess.CompletedProcess[str]:
        env = os.environ.copy()
        # Hermes injects its own site-packages through PYTHONPATH; remove it so
        # these tests exercise the project's selected Python environment instead
        # of a mixed Hermes/miniconda dependency set.
        env.pop("PYTHONPATH", None)
        env.update(env_overrides)
        return subprocess.run(
            [sys.executable, "-c", code],
            cwd=os.path.dirname(os.path.dirname(__file__)),
            env=env,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=10,
        )

    def test_production_refuses_default_jwt_secret(self):
        result = self.run_python_snippet(
            "from config import settings; settings.validate_runtime_security()",
            ENVIRONMENT="production",
            JWT_SECRET_KEY="change-me-in-production",
            DEEPSEEK_API_KEY="",
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("JWT_SECRET_KEY", result.stderr)
        self.assertIn("change-me-in-production", result.stderr)

    def test_development_allows_default_jwt_secret_for_local_work(self):
        result = self.run_python_snippet(
            "from config import settings; settings.validate_runtime_security(); print('ok')",
            ENVIRONMENT="development",
            JWT_SECRET_KEY="change-me-in-production",
            DEEPSEEK_API_KEY="",
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("ok", result.stdout)

    def test_production_accepts_strong_jwt_secret(self):
        result = self.run_python_snippet(
            "from config import settings; settings.validate_runtime_security(); print('ok')",
            ENVIRONMENT="production",
            JWT_SECRET_KEY="residual-path-production-secret-with-more-than-32-characters",
            DEEPSEEK_API_KEY="",
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("ok", result.stdout)


if __name__ == "__main__":
    unittest.main()
