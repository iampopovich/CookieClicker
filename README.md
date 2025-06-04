# Cookie Clicker Bot

## Project Description

This project is a Cookie Clicker bot that uses Puppeteer to automate playing the game. The bot will automatically open a browser window, navigate to the Cookie Clicker game, and start clicking the big cookie and buying upgrades.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    ```
    (Replace `<repository_url>` with the actual URL of this repository)

2.  **Install dependencies:**
    Navigate to the project directory and run:
    ```bash
    npm install
    ```

## Usage Instructions

1.  **Run the bot:**
    ```bash
    node app.js
    ```
2.  The bot will automatically open a new browser window (controlled by Puppeteer) and begin playing Cookie Clicker. It will click the main cookie and attempt to buy available upgrades.

## Configuration (`config.json`)

The `config.json` file is used to configure the bot's behavior.

```json
{
  "baseUrl": "https://orteil.dashnet.org/cookieclicker/",
  "strategy": "basic"
}
```

*   `baseUrl`: (String) The URL of the Cookie Clicker game. This should generally not be changed unless the game moves to a new address.
*   `strategy`: (String) This field is currently a placeholder for future development. The idea is to allow users to define different playing strategies (e.g., focusing on specific types of upgrades, different clicking patterns, or prioritizing certain achievements). In the current version, this field is not actively used to change bot behavior beyond a basic approach.

## Future Development Ideas

This project has several avenues for future enhancements:

*   **Implement Clicking/Purchasing Strategies:**
    *   Develop and implement various strategies in `app.js` based on the `strategy` field in `config.json`.
    *   Allow for more sophisticated decision-making on when to click, what upgrades to buy, and in what order.
*   **Robust Error Handling and Logging:**
    *   Improve error handling to gracefully manage unexpected game states or browser issues.
    *   Add more detailed logging to track the bot's actions, errors, and game progress.
*   **Upgrade and Achievement Management:**
    *   Develop a system to track available upgrades and unlocked achievements.
    *   Implement logic to prioritize certain upgrades or aim for specific achievements.
*   **Complete Dockerfile:**
    *   Finalize the `Dockerfile` to allow for easy containerization and deployment of the bot. This would simplify setup and ensure consistent runtime environments.
*   **UI/CLI for Configuration:**
    *   Potentially add a simple User Interface (UI) or Command Line Interface (CLI) to make it easier for users to configure the bot's settings without directly editing `config.json`.

## Contributing

Contributions are welcome! Please feel free to fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details (if one exists).
