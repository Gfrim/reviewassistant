'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-review.ts';
import '@/ai/flows/generate-title.ts';
import '@/ai/tools/google-scholar-search.ts';
