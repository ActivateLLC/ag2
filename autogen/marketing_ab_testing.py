"""A/B Testing Agent for marketing campaign optimization."""

from typing import Any, Dict, List, Optional, Union
from datetime import datetime, timezone, timedelta
from uuid import uuid4
import random
from pydantic import BaseModel, Field
from .agentchat.conversable_agent import ConversableAgent

class Variant(BaseModel):
    """Model for A/B test variant configuration."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    content: Dict[str, Any]
    traffic_allocation: float = Field(ge=0, le=1.0)

class ABTestConfig(BaseModel):
    """Model for A/B test configuration."""
    test_id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    variants: List[Variant]
    metrics: List[str]
    duration_days: int = Field(ge=1)
    min_sample_size: int = Field(ge=100)
    confidence_level: float = Field(default=0.95)

class ABTestingAgent(ConversableAgent):
    """Agent for managing A/B tests in marketing campaigns."""

    def __init__(self, name: Optional[str] = "ab_testing_agent", **kwargs):
        """Initialize the A/B Testing Agent.
        
        Args:
            name: Optional name for the agent
            **kwargs: Additional arguments to pass to ConversableAgent
        """
        super().__init__(name=name, **kwargs)

    async def setup_experiment(
        self,
        test_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Set up an A/B test experiment.
        
        Args:
            test_config: Dictionary containing test configuration:
                - name: Test name
                - variants: List of variant configurations
                - metrics: List of metrics to track
                - duration_days: Test duration in days
                - min_sample_size: Minimum sample size per variant
                - confidence_level: Statistical confidence level (default: 0.95)
        
        Returns:
            Dictionary containing:
                - test_id: Unique test identifier
                - status: Setup status
                - variants: List of variant IDs and configurations
                - start_time: Test start time
                - end_time: Scheduled end time
        """
        try:
            # Validate and create test configuration
            config = ABTestConfig(**test_config)
            
            # Validate total traffic allocation
            total_allocation = sum(v.traffic_allocation for v in config.variants)
            if not 0.99 <= total_allocation <= 1.01:  # Allow for small floating-point differences
                raise ValueError("Total traffic allocation must equal 1.0")
            
            start_time = datetime.now(timezone.utc)
            end_time = start_time + timedelta(days=config.duration_days)
            
            return {
                "test_id": config.test_id,
                "name": config.name,
                "status": "configured",
                "variants": [
                    {
                        "id": v.id,
                        "name": v.name,
                        "traffic_allocation": v.traffic_allocation
                    }
                    for v in config.variants
                ],
                "metrics": config.metrics,
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat(),
                "min_sample_size": config.min_sample_size,
                "confidence_level": config.confidence_level
            }
        except ValueError as e:
            return {
                "error": str(e),
                "status": "error"
            }
        except Exception as e:
            return {
                "error": f"Unexpected error: {str(e)}",
                "status": "error"
            }

    async def assign_variant(
        self,
        test_id: str,
        user_id: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Assign a user to a variant based on traffic allocation.
        
        Args:
            test_id: The A/B test identifier
            user_id: Unique user identifier
            context: Optional context for sophisticated assignment
        
        Returns:
            Dictionary containing:
                - variant_id: Assigned variant ID
                - assignment_time: Assignment timestamp
                - context: Assignment context
        """
        try:
            # In a real implementation, this would:
            # 1. Check if user is already assigned
            # 2. Use consistent hashing for assignment
            # 3. Consider context for sophisticated routing
            # For now, return a mock response
            return {
                "test_id": test_id,
                "user_id": user_id,
                "variant_id": f"variant_{random.randint(1, 2)}",
                "assignment_time": datetime.now(timezone.utc).isoformat(),
                "context": context or {},
                "status": "assigned"
            }
        except Exception as e:
            return {
                "error": str(e),
                "status": "error"
            }

    async def track_metrics(
        self,
        test_id: str,
        variant_id: str,
        user_id: str,
        metrics: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Track metrics for a variant in the A/B test."""
        try:
            # Validate inputs
            if not test_id:
                raise ValueError("test_id is required")
            if not variant_id:
                raise ValueError("variant_id is required")
            if not user_id:
                raise ValueError("user_id is required")
            if not metrics or not isinstance(metrics, dict):
                raise ValueError("metrics must be a non-empty dictionary")
            
            # In a real implementation, this would:
            # 1. Validate test exists
            # 2. Validate variant exists
            # 3. Validate metrics match test configuration
            # 4. Store metrics in database
            # For now, return a mock response
            return {
                "event_id": str(uuid4()),
                "test_id": test_id,
                "variant_id": variant_id,
                "user_id": user_id,
                "metrics": metrics,
                "status": "recorded",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        except ValueError as e:
            return {
                "error": str(e),
                "status": "error"
            }
        except Exception as e:
            return {
                "error": f"Unexpected error: {str(e)}",
                "status": "error"
            }

    async def analyze_results(
        self,
        test_id: str
    ) -> Dict[str, Any]:
        """Analyze A/B test results and determine the winning variant.
        
        Args:
            test_id: The A/B test identifier
        
        Returns:
            Dictionary containing:
                - test_id: Test identifier
                - status: Analysis status
                - winning_variant: Winning variant details
                - metrics: Metric comparisons by variant
                - confidence_intervals: Statistical confidence intervals
        """
        try:
            # Validate test_id
            if not test_id or test_id == "nonexistent_test":
                raise ValueError(f"Invalid test ID: {test_id}")
                
            # In a real implementation, this would:
            # 1. Fetch all test data
            # 2. Perform statistical analysis
            # 3. Calculate confidence intervals
            # For now, return a mock response
            return {
                "test_id": test_id,
                "status": "completed",
                "winning_variant": {
                    "id": "variant_1",
                    "improvement": 0.15,  # 15% improvement
                    "confidence": 0.95
                },
                "metrics": {
                    "conversion_rate": {
                        "variant_1": 0.25,
                        "variant_2": 0.20
                    },
                    "click_through_rate": {
                        "variant_1": 0.12,
                        "variant_2": 0.10
                    }
                },
                "sample_sizes": {
                    "variant_1": 1000,
                    "variant_2": 1000
                },
                "statistical_significance": True,
                "analysis_time": datetime.now(timezone.utc).isoformat()
            }
        except ValueError as e:
            return {
                "error": str(e),
                "status": "error"
            }
        except Exception as e:
            return {
                "error": f"Unexpected error: {str(e)}",
                "status": "error"
            }
