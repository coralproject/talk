# Test
How we do testing at Coral with Talk.

We use Nightwatch and Selenium for our E2E tests and Enzyme for our React Components.

## E2E tests
For our E2E Test we use Nightwatch and Selenium.

#### Selenium Server Setup

Selenium Server is a Java application which Nightwatch uses to connect to the various browsers.

You will need to have the Java Development Kit (JDK) installed.
[Java SE Development Kit 8 - Downloads](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

The minimum required version is 7.
You can check this by running  `java -version`

#### Folder Structure

```
e2e/
  ├── pages
  |   ├── adminPage.js
  |   └── embedStreamPage.js
  ├── reports
  ├── tests
  |   ├── Admin
  |   ├── Commenter
  |   ├── Moderator
  |   └── Visitor

```

#### Pages
Here we will have all the selectors and commands for a Page

#### Reports
The folder that Nightwatch will use after running the tests

#### Tests
Within `tests` folder we have 4 Folders and a couple of files.
`Admin`, `Commenter`, `Moderator`, `Visitor`  contains all the group tests based on the user role and their actions.

## Tests
The `pree2e`  script will create 3 users: a Commenter, a Moderator, and an Admin 

* Commenter
	* Login
	- Post a comment 
	* Likes a comment
	* Flag a comment
	* Flag a username
	* Gets Permalink
	* Visits Permalink

- Moderator 
	* Login 	
	
- Admin 
	* Login
	- Approve Comment
	- Reject Comment	
	* Ban User
	
- Visitor
	* Tries to like a comment
	* Tries to flag a comment 
	- Tries to flag a username	
	* Signs up
	
##  Run the tests
Run Talk
`dotenv npm run start`   

Run e2e tests   
`npm run e2e` 	
	

## Advanced Nightwatch and Selenium Settings	

### Adding an Integration Environment
```json
{
  …
  “test_settings” : {
    “default” : {
      “launch_url” : “http://localhost”,
      “globals” : {
        “myGlobalVar” : “some value”,
        “otherGlobal” : “some other value”
      }
    },
    “integration” : {
      “launch_url” : “http://staging.host”,
      “globals” : {
        “myGlobalVar” : “other value”
      }
    }
  }
}
```

`nightwatch —env integration`

### Chrome Options
[List of Chromium Command Line Switches «  Peter Beverloo](http://peter.sh/experiments/chromium-command-line-switches/) 

## Tags
You'll notice that each test file starts with tags. This is useful to selectively target tests to run.

_i.e nightwatch --tag login will only run login tests tagged with login_
```js
module.exports {
  '@tags': ['login'],
  'Test': browser => {
    [...]
  }
}
```

Source: http://nightwatchjs.org/guide#test-tags	

