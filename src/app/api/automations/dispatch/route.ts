import { NextResponse } from 'next/server';
import { Automation } from '@/models/Automation';
import { AutomationRun } from '@/models/AutomationRun';


export async function POST(req: Request) {
const { name } = await req.json();
const automation = await Automation.findOne({ where: { name, active: true } });
if (!automation) return NextResponse.json({ error: 'Not found' }, { status: 404 });


const run = await AutomationRun.create({ automation_id: automation.id, status: 'running' });
try {
// lightweight dispatcher — switch on name
switch (automation.name) {
case 'nightly-digest':
// await doNightlyDigest(automation.config)
break;
default:
throw new Error('No handler');
}
await run.update({ status: 'success' });
} catch (err: any) {
await run.update({ status: 'error', error_message: String(err?.message ?? err) });
}
return NextResponse.json({ ok: true });
}