async function getSkinURL(username) {

    const defaultSkin = { url: 'http://textures.minecraft.net/texture/60a5bd016b3c9a1b9272e4929e30827a67be4ebb219017adbbc4a4d22ebd5b1', model: "classic" };
    try {
        const version = username.startsWith('.') ? 'bedrock' : 'java';
        username = username.startsWith('.') ? username.substring(1) : username;

        if (version === 'java') {
            const uuidRes = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
            if (!uuidRes.ok) return defaultSkin;

            const { id: uuid } = await uuidRes.json();
            const skinRes = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
            if (!skinRes.ok) return defaultSkin;

            const { properties } = await skinRes.json();
            const skinData = JSON.parse(atob(properties[0].value)).textures.SKIN;
            const model = skinData.metadata && skinData.metadata.model ? skinData.metadata.model : "classic"

            return { url: skinData.url, model: model };
        }

        if (version === 'bedrock') {
            const xuidRes = await fetch(`https://api.geysermc.org/v2/xbox/xuid/${username}`);
            if (!xuidRes.ok) return defaultSkin;

            const { xuid } = await xuidRes.json();
            const skinRes = await fetch(`https://api.geysermc.org/v2/skin/${xuid}`);
            if (!skinRes.ok) return defaultSkin;

            const response = await skinRes.json()
            const url = `https://textures.minecraft.net/texture/${response.texture_id}`
            const model = response.is_steve ? "classic" : "slim";

            return { url: url, model: model  };
        }

        return defaultSkin;
    } catch (error) {
        console.error('Error in getSkinURL:', error);
        return defaultSkin;
    }
}

module.exports = { getSkinURL };