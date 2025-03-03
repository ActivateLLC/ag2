/**
 * Core metrics processing for Arise Cares Platform
 * 
 * This module provides the core metrics processing logic used across
 * all components of the Arise Cares platform.
 */

import { getConfig } from '@arise-cares/config';

// Types for caregiver metrics
export interface CaregiverMetrics {
  caregiverId: string;
  name: string;
  metrics: {
    visitCompliance: number;
    skillProficiency: number;
    continuousEducation: number;
    clientSatisfaction: number;
    riskManagement: number;
  };
  specialtyCare?: {
    dementiaCare?: {
      behaviorManagement: number;
      medicationAdherence: number;
      routineMaintenance: number;
    };
    woundCare?: {
      healingRates: number;
      infectionPrevention: number;
      documentationAccuracy: number;
    };
    fallPrevention?: {
      riskAssessments: number;
      interventionImplementations: number;
      incidentReduction: number;
    };
    chronicDiseaseManagement?: {
      symptomManagement: number;
      medicationCompliance: number;
      vitalMonitoring: number;
    };
  };
  peerComparison?: {
    percentile: number;
    topMetrics: string[];
    belowAverageMetrics: string[];
  };
  recommendedTraining?: Array<{
    type: string;
    focus: string;
    priority: 'low' | 'medium' | 'high';
    expectedImpact: string;
  }>;
  lastUpdated: string;
}

// Types for marketing metrics
export interface MarketingMetrics {
  website: {
    traffic: number;
    conversionRate: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  localSeo: {
    googleRanking: number;
    reviewScore: number;
    reviewCount: number;
    citationConsistency: number;
  };
  socialMedia: {
    followers: number;
    engagement: number;
    postFrequency: number;
    conversionRate: number;
  };
  lastUpdated: string;
}

// Types for client outcome metrics
export interface ClientOutcomeMetrics {
  clientId: string;
  caregiverId: string;
  healthMetrics: {
    initialAssessment: number;
    currentAssessment: number;
    trend: string;
  };
  qualityOfLifeMetrics: {
    initialAssessment: number;
    currentAssessment: number;
    trend: string;
  };
  familySatisfaction: {
    initial: number;
    current: number;
    trend: string;
  };
  lastUpdated: string;
}

/**
 * Calculate the overall quality score for a caregiver
 * @param metrics Caregiver metrics
 * @returns Overall quality score (0-100)
 */
export function calculateOverallQualityScore(metrics: CaregiverMetrics): number {
  const config = getConfig();
  
  // Get base metrics
  const {
    visitCompliance,
    skillProficiency,
    continuousEducation,
    clientSatisfaction,
    riskManagement
  } = metrics.metrics;
  
  // Calculate base score with weightings
  let score = (
    visitCompliance * 0.25 +
    skillProficiency * 0.20 +
    continuousEducation * 0.15 +
    clientSatisfaction * 0.30 +
    riskManagement * 0.10
  );
  
  // Apply specialty bonus if applicable
  if (metrics.specialtyCare) {
    // Calculate average specialty score if any specialty is present
    let specialtyScore = 0;
    let specialtyCount = 0;
    
    if (metrics.specialtyCare.dementiaCare) {
      const dementiaScore = (
        metrics.specialtyCare.dementiaCare.behaviorManagement +
        metrics.specialtyCare.dementiaCare.medicationAdherence +
        metrics.specialtyCare.dementiaCare.routineMaintenance
      ) / 3;
      specialtyScore += dementiaScore;
      specialtyCount += 1;
    }
    
    if (metrics.specialtyCare.woundCare) {
      const woundScore = (
        metrics.specialtyCare.woundCare.healingRates +
        metrics.specialtyCare.woundCare.infectionPrevention +
        metrics.specialtyCare.woundCare.documentationAccuracy
      ) / 3;
      specialtyScore += woundScore;
      specialtyCount += 1;
    }
    
    if (metrics.specialtyCare.fallPrevention) {
      const fallScore = (
        metrics.specialtyCare.fallPrevention.riskAssessments +
        metrics.specialtyCare.fallPrevention.interventionImplementations +
        metrics.specialtyCare.fallPrevention.incidentReduction
      ) / 3;
      specialtyScore += fallScore;
      specialtyCount += 1;
    }
    
    if (metrics.specialtyCare.chronicDiseaseManagement) {
      const chronicScore = (
        metrics.specialtyCare.chronicDiseaseManagement.symptomManagement +
        metrics.specialtyCare.chronicDiseaseManagement.medicationCompliance +
        metrics.specialtyCare.chronicDiseaseManagement.vitalMonitoring
      ) / 3;
      specialtyScore += chronicScore;
      specialtyCount += 1;
    }
    
    // Apply specialty bonus (up to 10 points)
    if (specialtyCount > 0) {
      const avgSpecialtyScore = specialtyScore / specialtyCount;
      // Bonus formula: Up to 10 points based on specialty score
      const specialtyBonus = Math.min(10, (avgSpecialtyScore - 70) / 3);
      score += Math.max(0, specialtyBonus);
    }
  }
  
  // Ensure score is within valid range
  return Math.min(100, Math.max(0, score));
}

/**
 * Generate recommended training for a caregiver based on their metrics
 * @param metrics Caregiver metrics
 * @returns List of recommended training
 */
export function generateTrainingRecommendations(metrics: CaregiverMetrics): Array<{
  type: string;
  focus: string;
  priority: 'low' | 'medium' | 'high';
  expectedImpact: string;
}> {
  const config = getConfig();
  const recommendations = [];
  
  // Check visit compliance
  if (metrics.metrics.visitCompliance < config.caregiverMetrics.minimumVisitCompliance) {
    recommendations.push({
      type: 'workshop',
      focus: 'Time Management and Visit Planning',
      priority: 'high',
      expectedImpact: 'Improved visit compliance by 15%'
    });
  }
  
  // Check skill proficiency
  if (metrics.metrics.skillProficiency < config.caregiverMetrics.skillProficiencyThreshold) {
    recommendations.push({
      type: 'hands-on',
      focus: 'Core Caregiving Skills Refresher',
      priority: 'high',
      expectedImpact: 'Increased skill proficiency by 20%'
    });
  }
  
  // Check client satisfaction
  if (metrics.metrics.clientSatisfaction < config.caregiverMetrics.targetClientSatisfaction) {
    recommendations.push({
      type: 'course',
      focus: 'Client Communication and Relationship Building',
      priority: 'medium',
      expectedImpact: 'Improved client satisfaction by 12%'
    });
  }
  
  // Check continuous education
  if (metrics.metrics.continuousEducation < config.caregiverMetrics.trainingCompletionTarget) {
    recommendations.push({
      type: 'online',
      focus: 'Continuing Education Requirements',
      priority: 'medium',
      expectedImpact: 'Complete required continuing education credits'
    });
  }
  
  // Check specialty care opportunities
  if (metrics.specialtyCare) {
    // Recommend training for low specialty scores
    if (
      metrics.specialtyCare.dementiaCare && 
      (
        metrics.specialtyCare.dementiaCare.behaviorManagement < 80 ||
        metrics.specialtyCare.dementiaCare.medicationAdherence < 80 ||
        metrics.specialtyCare.dementiaCare.routineMaintenance < 80
      )
    ) {
      recommendations.push({
        type: 'certification',
        focus: 'Advanced Dementia Care',
        priority: 'high',
        expectedImpact: 'Improved dementia care outcomes by 25%'
      });
    }
    
    if (
      metrics.specialtyCare.woundCare && 
      (
        metrics.specialtyCare.woundCare.healingRates < 80 ||
        metrics.specialtyCare.woundCare.infectionPrevention < 80 ||
        metrics.specialtyCare.woundCare.documentationAccuracy < 80
      )
    ) {
      recommendations.push({
        type: 'certification',
        focus: 'Wound Care Specialist Training',
        priority: 'medium',
        expectedImpact: 'Improved wound healing rates by 30%'
      });
    }
  }
  
  // Check peer comparison
  if (metrics.peerComparison && metrics.peerComparison.percentile < 50) {
    // Recommend general improvement for below-average caregivers
    recommendations.push({
      type: 'mentoring',
      focus: 'Peer Mentoring Program',
      priority: 'high',
      expectedImpact: 'Overall performance improvement across multiple metrics'
    });
  }
  
  return recommendations;
}

/**
 * Calculate the marketing value of a caregiver based on their metrics
 * @param metrics Caregiver metrics
 * @returns Marketing value score (0-100)
 */
export function calculateMarketingValue(metrics: CaregiverMetrics): number {
  // Marketing value is based on client satisfaction, specialty care, and skill proficiency
  const baseValue = metrics.metrics.clientSatisfaction * 0.5;
  
  // Add value for specialties (each specialty adds up to 10 points)
  let specialtyValue = 0;
  if (metrics.specialtyCare) {
    if (metrics.specialtyCare.dementiaCare) {
      const dementiaAvg = (
        metrics.specialtyCare.dementiaCare.behaviorManagement +
        metrics.specialtyCare.dementiaCare.medicationAdherence +
        metrics.specialtyCare.dementiaCare.routineMaintenance
      ) / 3;
      specialtyValue += Math.min(10, (dementiaAvg - 70) / 3);
    }
    
    if (metrics.specialtyCare.woundCare) {
      const woundAvg = (
        metrics.specialtyCare.woundCare.healingRates +
        metrics.specialtyCare.woundCare.infectionPrevention +
        metrics.specialtyCare.woundCare.documentationAccuracy
      ) / 3;
      specialtyValue += Math.min(10, (woundAvg - 70) / 3);
    }
    
    // Cap specialty value at 25 points
    specialtyValue = Math.min(25, specialtyValue);
  }
  
  // Add value for skill proficiency (up to 15 points)
  const proficiencyValue = metrics.metrics.skillProficiency * 0.15;
  
  // Add value for top percentile (up to 10 points)
  let percentileValue = 0;
  if (metrics.peerComparison) {
    percentileValue = metrics.peerComparison.percentile >= 90 ? 10 : 
                      metrics.peerComparison.percentile >= 75 ? 5 : 0;
  }
  
  // Calculate total marketing value
  const marketingValue = baseValue + specialtyValue + proficiencyValue + percentileValue;
  
  // Ensure value is within valid range
  return Math.min(100, Math.max(0, marketingValue));
}

/**
 * Generate marketing content suggestions based on caregiver metrics
 * @param metrics Caregiver metrics
 * @returns List of content suggestions
 */
export function generateContentSuggestions(metrics: CaregiverMetrics): Array<{
  title: string;
  keywords: string[];
  metricsSource: string;
  score: number;
  opportunity: 'low' | 'medium' | 'high';
}> {
  const suggestions = [];
  
  // Client satisfaction content
  if (metrics.metrics.clientSatisfaction >= 90) {
    suggestions.push({
      title: "The Arise Difference: Why Our Caregivers Excel in Client Satisfaction",
      keywords: ["client satisfaction", "quality care", "caregiver reviews"],
      metricsSource: "metrics.clientSatisfaction",
      score: metrics.metrics.clientSatisfaction,
      opportunity: "high"
    });
  }
  
  // Specialty care content
  if (metrics.specialtyCare) {
    if (metrics.specialtyCare.dementiaCare && 
        metrics.specialtyCare.dementiaCare.behaviorManagement >= 85) {
      suggestions.push({
        title: "How Our Specialized Dementia Care Training Improves Patient Outcomes",
        keywords: ["dementia care", "caregiver training", "memory care"],
        metricsSource: "dementiaCare.behaviorManagement",
        score: metrics.specialtyCare.dementiaCare.behaviorManagement,
        opportunity: "high"
      });
    }
    
    if (metrics.specialtyCare.woundCare && 
        metrics.specialtyCare.woundCare.healingRates >= 85) {
      suggestions.push({
        title: "Advanced Wound Care: How Our Caregivers Accelerate Healing",
        keywords: ["wound care", "healing rates", "home healthcare"],
        metricsSource: "woundCare.healingRates",
        score: metrics.specialtyCare.woundCare.healingRates,
        opportunity: "medium"
      });
    }
    
    if (metrics.specialtyCare.fallPrevention && 
        metrics.specialtyCare.fallPrevention.incidentReduction >= 85) {
      suggestions.push({
        title: "Fall Prevention: How Our Caregivers Keep Clients Safe",
        keywords: ["fall prevention", "senior safety", "home care safety"],
        metricsSource: "fallPrevention.incidentReduction",
        score: metrics.specialtyCare.fallPrevention.incidentReduction,
        opportunity: "medium"
      });
    }
  }
  
  // High skill proficiency content
  if (metrics.metrics.skillProficiency >= 90) {
    suggestions.push({
      title: "The Expertise Difference: Why Arise Caregivers Stand Out",
      keywords: ["caregiver expertise", "professional caregiving", "skilled care"],
      metricsSource: "metrics.skillProficiency",
      score: metrics.metrics.skillProficiency,
      opportunity: "medium"
    });
  }
  
  // Top percentile content
  if (metrics.peerComparison && metrics.peerComparison.percentile >= 90) {
    suggestions.push({
      title: "Top-Tier Care: What Sets Our Elite Caregivers Apart",
      keywords: ["best caregivers", "top-rated care", "quality home care"],
      metricsSource: "peerComparison.percentile",
      score: metrics.peerComparison.percentile,
      opportunity: "high"
    });
  }
  
  return suggestions;
}

export default {
  calculateOverallQualityScore,
  generateTrainingRecommendations,
  calculateMarketingValue,
  generateContentSuggestions
};
