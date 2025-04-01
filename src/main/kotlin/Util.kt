package com.maltsburg

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.*
import java.util.Base64

object Util {

    private val defaultID = "60a5bd016b3c9a1b9272e4929e30827a67be4ebb219017adbbc4a4d22ebd5b1"
    private val defaultSkin = "http://textures.minecraft.net/texture/${defaultID}"

    private val JsonElement.clean: String get() = this.jsonPrimitive.content
    private fun JsonElement.get(key: String): String? = this.jsonArray[0].jsonObject[key]?.clean
    private val client = HttpClient { install(ContentNegotiation) { json() } }

    fun java(name: String): Pair<String, String> {
        return runBlocking {
            val pInfo: JsonObject = // get uuid
                client.get("https://api.mojang.com/users/profiles/minecraft/${name}").body()

            val profile: JsonObject = // get player profile
                client.get("https://sessionserver.mojang.com/session/minecraft/profile/${pInfo["id"]?.clean}").body()

            // get the encoded textures
            val textures = profile["properties"]?.get("value")
            val skinInfo = Base64.getDecoder().decode(textures).decodeToString()

            //convert string back to json
            val decodedJson: JsonObject = Json.parseToJsonElement(skinInfo).jsonObject
            val skinData = decodedJson["textures"]?.jsonObject
                ?.get("SKIN")?.jsonObject

            val url = skinData
                ?.get("url")?.clean ?: defaultSkin

            val model = skinData
                ?.get("metadata")?.jsonObject
                ?.get("model")?.clean ?: "classic"

            Pair(url, model)
        }
    }

    fun bedrock(name: String): Pair<String, String> {
        return runBlocking {
            val pInfo: JsonObject = // get xuid
                client.get("https://api.geysermc.org/v2/xbox/xuid/${name}").body()

            val profile: JsonObject = // get skin info
                client.get("https://api.geysermc.org/v2/skin/${pInfo["xuid"]?.clean}").body()

            val url = "http://textures.minecraft.net/texture/${profile["texture_id"]?.clean ?: defaultID}"

            val model = if (profile["is_steve"]?.clean == "true")
                "classic" else "slim"

            Pair(url, model)
        }
    }
}