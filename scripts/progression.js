// tracks which levels the player has unlocked
const Progression = {
    unlock(level) {
        const current = parseInt(localStorage.getItem('net_progression') || '1');
        if (level > current) {
            localStorage.setItem('net_progression', level);
        }
    }
};
