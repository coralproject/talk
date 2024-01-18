## Wordpress Dev Environment

This is a dev environment for testing out the [talk-wp-plugin](https://github.com/coralproject/talk-wp-plugin) with Coral.

### Usage

- Spin up the mysql and wordpress containers:

    ```
    cd wordpress
    docker-compose up
    ```

- Spin up Coral and add `http://localhost:8081` to a new or existing site so the new Wordpress URL is allowed.

- Then navigate to `http://localhost:8081`.

- Follow the steps to create a new admin user for the wordpress deployment.

- Install the plugin from [talk-wp-plugin](https://github.com/coralproject/talk-wp-plugin) by downloading the source code and zipping it up into a `.zip` archive.

- Navigate to http://localhost:8081/wp-admin/plugins.php and click `Add New Plugin`.

- From there, click `Upload Plugin`.

- Point it to the `talk-wp-plugin` archive you created from its source code.

- Enable the Coral plugin in the `Installed Plugins` list if it is not already enabled.

- Go to `Settings > Coral Settings` and set the `Server Base URL` to http://localhost:3000 or http://localhost:8080 based on whether you're running Coral standalone or in watch mode.

- Head to `Appearance > Themes` and select the oldest theme you can find (Twenty Twenty-Two as of this writing) as the Coral plugin can't override the PHP for comments in newer themes yet.
    - If you need to set this manually, check the [README](https://github.com/coralproject/talk-wp-plugin?tab=readme-ov-file#theme-usage) on the `talk-wp-plugin` repo for how to [edit the theme to show Coral comments](https://github.com/coralproject/talk-wp-plugin?tab=readme-ov-file#theme-usage).