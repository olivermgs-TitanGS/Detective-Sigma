// Client for the Case Generator Microservice

const CASE_GENERATOR_URL = process.env.CASE_GENERATOR_URL || 'http://localhost:4000';

export interface GenerationRequest {
  difficulty: 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF';
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED';
  gradeLevel?: 'P4' | 'P5' | 'P6';
  constraints?: {
    excludeThemes?: string[];
    requiredSkills?: string[];
    estimatedMinutes?: number;
  };
  preferences?: {
    culturalContext?: 'singapore' | 'generic';
    includeAssets?: boolean;
    strategy?: 'template' | 'ai' | 'hybrid';
  };
}

export interface GenerationJobResponse {
  jobId: string;
  status: string;
  message: string;
  estimatedTime?: number;
}

export interface JobStatusResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
}

export class CaseGeneratorClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || CASE_GENERATOR_URL;
  }

  // Start case generation
  async generateCase(request: GenerationRequest): Promise<GenerationJobResponse> {
    const response = await fetch(this.baseUrl + '/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start generation');
    }

    return response.json();
  }

  // Check job status
  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    const response = await fetch(this.baseUrl + '/api/status/' + jobId);

    if (!response.ok) {
      throw new Error('Failed to get job status');
    }

    return response.json();
  }

  // Get generated case
  async getCase(caseId: string): Promise<any> {
    const response = await fetch(this.baseUrl + '/api/case/' + caseId);

    if (!response.ok) {
      throw new Error('Failed to get case');
    }

    return response.json();
  }

  // Poll until complete
  async waitForCompletion(jobId: string, pollInterval = 2000, timeout = 300000): Promise<any> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const status = await this.getJobStatus(jobId);

      if (status.status === 'completed') {
        return status.result;
      }

      if (status.status === 'failed') {
        throw new Error(status.error || 'Generation failed');
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error('Generation timed out');
  }
}

// Singleton instance
export const caseGenerator = new CaseGeneratorClient();
