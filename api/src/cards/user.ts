

export class UserSettings {
    constructor() {
    }

    public getColorByInitials(initials: string) {
        const colors = [
            "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFF5", "#F5FF33", "#FF8C33",
            "#8C33FF", "#33FF8C", "#FF3333", "#33A8FF", "#A8FF33", "#5733FF", "#FF5733", "#FFAA33",
            "#33FFAA", "#AA33FF", "#FF3357", "#3357FF", "#FFAA57", "#57FFAA", "#AA57FF", "#33FFA8"
        ];
    
        if (!initials || initials.length === 0) return { background: "#CCCCCC", text: "#000000" };
    
        const normalizedInitials = initials.toUpperCase();
        const charCodeSum = normalizedInitials.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const background = colors[charCodeSum % colors.length];
    
        const text = this.getContrastColor(background);
    
        return { background, text };
    }
    
    private getContrastColor(hex: string): string {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
    
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
        return brightness > 128 ? "#000000" : "#FFFFFF";
    }

    public getRandomCode(length: number): string {
        const randomNumber = Math.floor((Math.random() * 1000000) + 1000);
        const randomCode = randomNumber.toString(16).padStart(length, '0');
        return randomCode;
    }
}