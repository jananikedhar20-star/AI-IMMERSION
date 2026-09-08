from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "UP"

def test_field_mapping():
    res = client.post("/api/v1/ai/field-mapping", json={"sourceHeaders": ["BL_No", "Basic_Freight", "OTHC", "Total_Billed"]})
    assert res.status_code == 200
    data = res.json()
    assert len(data["mappings"]) == 4

print("AI service test file created")
