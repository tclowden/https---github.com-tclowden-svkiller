import { Role } from '@/models/Role';
import { User } from '@/models/User';


export async function userHasRole(userId: string, roleName: string) {
const user = await User.findByPk(userId, { include: [Role] });
return !!user?.roles?.some(r => r.name === roleName);
}