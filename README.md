# Instagram-Story-Downloader
A Fully Configurable Instagram Downloader! To Download Instagram Storys from every User

## How to install

* Download the repository
* Run ```npm install``` inside of your terminal!
* Rename the file .env.example to .env!
* Insert your specific ig data into the .env at the marked positions!
* Choose if you want Authorization by changing USE_AUTH from true for Authorization to false for no Authorization
* Change the port if needed.
* Run ```npm run start``` inside of your terminal! To Start the Programm


## How to use

* Make sure that when you have auth enabled that you specify the auth_token from the .env file in the request headers under token

* Story | Make a simple GET request to the URL http://example.com:9090/download/storys/USERNAME and Replace the Username with the account username from instagram you wanna download!
* Reels | Make a simple GET request to the URL http://example.com:9090/download/reels/USERNAME and Replace the Username with the account username from instagram you wanna download!
* Particular Reel | Make a simple GET request to the URL http://example.com:9090/download/reels/USERNAME/CODE and Replace the Username with the account username from instagram you wanna download! and replace the code with the particualr reel you wanna download
* You can also make a GET request to the URL http://example.com:9090/cache/USERNAME When you only want to cache the userID
