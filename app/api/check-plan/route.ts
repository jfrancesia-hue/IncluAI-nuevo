import { NextResponse } from 'next/server';
import { checkPlanLimits } from '@/lib/plan';

export async function GET() {
  const plan = await checkPlanLimits();
  return NextResponse.json(plan);
}
