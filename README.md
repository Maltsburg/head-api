# HeadGrabber API

This Express.js server generates Minecraft player head images.

## Features
* Supports both Java and Bedrock Edition usernames (Bedrock usernames should be prefixed with a dot, e.g., `.PlayerName`).
* Scalable output (8px to 512px).
* Optional `style` parameter for different head styles (currently supports `grey` and `invert`).

## Prerequisites

* [Node.js](https://nodejs.org)

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/Maltsburg/head-api
    cd head-api
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

## Usage

1.  Start the server:

    ```bash
    node server.js
    ```

2.  Access the endpoint:

    ```
    /head/<username>/<size>?style=<style>
    ```

    * `<username>`: The Minecraft username. For Bedrock Edition, prefix with a dot (e.g., `.PlayerName`).
    * `<size>`: (Optional) The size of the head image in pixels (8 to 512). Defaults to 32.
    * `<style>`: (Optional) The style of the head. Available styles: `grey`, `invert`.

    **Examples:**

    * `http://localhost:2095/head/Maltsburg` (Java Edition, 32x32 pixels, default style)
    * `http://localhost:2095/head/Maltsburg?style=grey` (Java Edition, 32x32 pixels, greyscale)
    * `http://localhost:2095/head/.Maltsburg/64` (Bedrock Edition, 64x64 pixels, default style)
    * `http://localhost:2095/head/.Maltsburg/128?style=invert` (Bedrock Edition, 128x128 pixels, inverted)

## Dependencies

* `express`: Web framework for Node.js.
* `canvas`: Node.js canvas library for image manipulation.
* `cors`: Provides Express middleware to enable CORS.

Feel free to submit pull requests to help make **HeadGrabber** better!.