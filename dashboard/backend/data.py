"""
Sample data for the dashboard API

This module provides sample data for development and testing.
Replace with actual database queries in production.
"""

sample_data = {
    "caregivers": {
        "CG001": {
            "id": "CG001",
            "name": "John Smith",
            "role": "Home Health Aide",
            "metrics": {
                "client_satisfaction": {
                    "score": 92,
                    "benchmark": 85,
                    "trend": "+3%"
                },
                "visit_timeliness": {
                    "score": 88,
                    "benchmark": 90,
                    "trend": "-2%"
                },
                "documentation_quality": {
                    "score": 95,
                    "benchmark": 80,
                    "trend": "+5%"
                },
                "medication_management": {
                    "score": 90,
                    "benchmark": 95,
                    "trend": "-1%"
                },
                "communication_skills": {
                    "score": 94,
                    "benchmark": 85,
                    "trend": "+4%"
                }
            },
            "history": [
                {"date": "2025-01", "score": 89},
                {"date": "2025-02", "score": 91},
                {"date": "2025-03", "score": 92}
            ]
        },
        "CG002": {
            "id": "CG002",
            "name": "Maria Garcia",
            "role": "Registered Nurse",
            "metrics": {
                "client_satisfaction": {
                    "score": 96,
                    "benchmark": 85,
                    "trend": "+6%"
                },
                "visit_timeliness": {
                    "score": 94,
                    "benchmark": 90,
                    "trend": "+4%"
                },
                "documentation_quality": {
                    "score": 92,
                    "benchmark": 80,
                    "trend": "+12%"
                },
                "medication_management": {
                    "score": 98,
                    "benchmark": 95,
                    "trend": "+3%"
                },
                "communication_skills": {
                    "score": 95,
                    "benchmark": 85,
                    "trend": "+10%"
                }
            },
            "history": [
                {"date": "2025-01", "score": 94},
                {"date": "2025-02", "score": 95},
                {"date": "2025-03", "score": 96}
            ]
        },
        "CG003": {
            "id": "CG003",
            "name": "David Johnson",
            "role": "Personal Care Assistant",
            "metrics": {
                "client_satisfaction": {
                    "score": 88,
                    "benchmark": 85,
                    "trend": "+1%"
                },
                "visit_timeliness": {
                    "score": 91,
                    "benchmark": 90,
                    "trend": "+1%"
                },
                "documentation_quality": {
                    "score": 84,
                    "benchmark": 80,
                    "trend": "+4%"
                },
                "medication_management": {
                    "score": 89,
                    "benchmark": 95,
                    "trend": "-6%"
                },
                "communication_skills": {
                    "score": 90,
                    "benchmark": 85,
                    "trend": "+5%"
                }
            },
            "history": [
                {"date": "2025-01", "score": 87},
                {"date": "2025-02", "score": 88},
                {"date": "2025-03", "score": 88}
            ]
        }
    },
    "performance": {
        "overall_score": 91,
        "metrics": {
            "client_satisfaction": {
                "score": 93,
                "benchmark": 85,
                "trend": "+4%"
            },
            "visit_timeliness": {
                "score": 89,
                "benchmark": 90,
                "trend": "-1%"
            },
            "documentation_quality": {
                "score": 91,
                "benchmark": 80,
                "trend": "+11%"
            },
            "medication_management": {
                "score": 94,
                "benchmark": 95,
                "trend": "-1%"
            },
            "communication_skills": {
                "score": 92,
                "benchmark": 85,
                "trend": "+7%"
            }
        },
        "history": [
            {"date": "2025-01", "score": 89},
            {"date": "2025-02", "score": 90},
            {"date": "2025-03", "score": 91}
        ]
    },
    "reports": {
        "performance": {
            "summary": {
                "overall_score": 91,
                "improvement": "+2%",
                "areas_of_concern": ["visit_timeliness", "medication_management"],
                "strengths": ["documentation_quality", "client_satisfaction"]
            },
            "caregivers": {
                "top_performers": ["CG002", "CG003", "CG007"],
                "needs_improvement": ["CG004", "CG009"]
            },
            "recommendations": [
                "Provide additional training on medication management",
                "Implement visit scheduling optimization",
                "Recognize top performers with monthly awards"
            ]
        },
        "compliance": {
            "summary": {
                "overall_compliance": 87,
                "improvement": "+1%",
                "areas_of_concern": ["documentation_timeliness"],
                "strengths": ["visit_completion", "care_plan_adherence"]
            },
            "caregivers": {
                "top_performers": ["CG001", "CG005", "CG008"],
                "needs_improvement": ["CG006", "CG010"]
            },
            "recommendations": [
                "Implement mobile documentation tools",
                "Provide documentation templates",
                "Schedule regular compliance reviews"
            ]
        }
    }
}
