"""
Test configuration for pytest
"""

import pytest
import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))


@pytest.fixture
def sample_vulnerable_code():
    """Sample vulnerable Python code for testing"""
    return """
import os
user_id = input("Enter user ID: ")
query = f"SELECT * FROM users WHERE id = {user_id}"
password = "secret123"
os.system(f"ls {user_id}")
"""


@pytest.fixture
def sample_safe_code():
    """Sample safe Python code for testing"""
    return """
import os
user_id = input("Enter user ID: ")
query = "SELECT * FROM users WHERE id = ?"
cursor.execute(query, [user_id])
password = os.getenv("DB_PASSWORD")
subprocess.run(["ls", user_id], check=True)
"""
