import User from '@/classes/user';
import { SocketInstance } from '@/plugins/socketio.ts';

export class UserService {
    public currentUser: User;
    private activeTimeout: NodeJS.Timeout;

    // Trigger inactivity if 5 seconds elapsed without the user clicking or typing
    public checkActive() {
        if (!this.currentUser) {
            return;
        }

        clearTimeout(this.activeTimeout);

        if (!this.currentUser.active) {
            this.currentUser.active = true;
            SocketInstance.emit('activity', { userId: this.currentUser.id, active: this.currentUser.active });
        }

        this.activeTimeout = setTimeout(() => {
            if (this.currentUser.active) {
                this.currentUser.active = false;
                SocketInstance.emit('activity', { userId: this.currentUser.id, active: this.currentUser.active });
            }
        }, 1000 * 5);
    }
}

export const userService: UserService = new UserService();
