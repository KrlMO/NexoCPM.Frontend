export class EncodingUtil {

    static encodeEmail(email: string): string {
        return btoa(email);
    }

    static decodeEmail(encoded: string): string {
        return atob(encoded);
    }

    static maskEmail(email: string): string {
        const [local, domain] = email.split('@');

        if (!domain) return email;

        if (local.length <= 2) {
            return `${local[0]}***@${domain}`;
        }

        const visible = local.slice(0, 2);
        const masked = '*'.repeat(Math.max(local.length - 2, 3));

        return `${visible}${masked}@${domain}`;
    }
}