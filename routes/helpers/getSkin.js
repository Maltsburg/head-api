async function getSkin(username, version) {
    const defaultSkinUrl = 'http://textures.minecraft.net/texture/60a5bd016b3c9a1b9272e4929e30827a67be4ebb219017adbbc4a4d22ebd5b1';
    try {
        if (version === 'java') {
            const uuidRes = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`);
            if (!uuidRes.ok) return defaultSkinUrl;

            const { id: uuid } = await uuidRes.json();
            const skinRes = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
            if (!skinRes.ok) return defaultSkinUrl;

            const { properties } = await skinRes.json();
            return JSON.parse(atob(properties[0].value)).textures.SKIN.url;
        }

        if (version === 'bedrock') {
            const xuidRes = await fetch(`https://api.geysermc.org/v2/xbox/xuid/${encodeURIComponent(username)}`);
            if (!xuidRes.ok) return defaultSkinUrl;

            const { xuid } = await xuidRes.json();
            const skinRes = await fetch(`https://api.geysermc.org/v2/skin/${xuid}`);
            if (!skinRes.ok) return defaultSkinUrl;

            return `https://textures.minecraft.net/texture/${(await skinRes.json()).texture_id}`;
        }

        return defaultSkinUrl;
    } catch (error) {
        console.error('Error in getSkin:', error);
        return defaultSkinUrl;
    }
}

module.exports = { getSkin };