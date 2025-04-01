package com.maltsburg

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
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
            // get player info
            val pInfoResponse: HttpResponse =
                client.get("https://api.mojang.com/users/profiles/minecraft/${name}")
            if (pInfoResponse.status != HttpStatusCode.OK) return@runBlocking Pair(defaultSkin, "classic")
            val pInfo: JsonObject = pInfoResponse.body()

            // get player profile
            val profileResponse: HttpResponse =
                client.get("https://sessionserver.mojang.com/session/minecraft/profile/${pInfo["id"]?.clean}")
            if (profileResponse.status != HttpStatusCode.OK) return@runBlocking Pair(defaultSkin, "classic")
            val profile: JsonObject = profileResponse.body()

            // get the encoded textures
            val textures = profile["properties"]?.get("value")
            val skinInfo = Base64.getDecoder().decode(textures).decodeToString()
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
            // get player info
            val pInfoResponse: HttpResponse = client.get("https://api.geysermc.org/v2/xbox/xuid/${name}")
            if (pInfoResponse.status != HttpStatusCode.OK) return@runBlocking Pair(defaultSkin, "classic")
            val pInfo: JsonObject = pInfoResponse.body()

            // get player skin
            val profileResponse: HttpResponse = client.get("https://api.geysermc.org/v2/skin/${pInfo["xuid"]?.clean}")
            if (profileResponse.status != HttpStatusCode.OK) return@runBlocking Pair(defaultSkin, "classic")
            val profile: JsonObject = profileResponse.body() // get skin info

            val url = "http://textures.minecraft.net/texture/${profile["texture_id"]?.clean ?: defaultID}"
            val model = if (profile["is_steve"]?.clean == "true" || profile["is_steve"] == null)
                "classic" else "slim"

            Pair(url, model)
        }
    }
}