# heroes-manual-tool
A tool to assist the development team for Heroes Manual to add content to the application


## IMPORTANT
Be careful when adding .json files to the git repository. Only add them if you want to add them, cause if others pull it will override their changes. AKA never push JSON file changes to origin.

Basically when you are done using the tool make sure to make a copy of the JSON file you created and save it to another directory. If you need to go back or load a json file you already made then replace the respective training.json or quizzes.json file with your own, but make sure you rename the file to match the former.

## How to use
To use this tool, clone the git repo to your computer.

cd into the repo and then into the /server directory

You will need python3, pip, and flask to run the tool.

Install Python 3 on your computer however you would like to. Then you will need to install Flask, a Python library. 

I believe you can install Flask using >>

```
pip install Flask
```

Once you have installed Python 3 and Flask make sure you are in the server directory and use

```
flask run

-- or --

python3 -m flask run
```

You should see a message saying the server is running on 127.0.0.1 (localhost) and you can open that address in your favorite browser. Hopefully you'll see the base page and then can navigate to each tool


## IMPORTANT