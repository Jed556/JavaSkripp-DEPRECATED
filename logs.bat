@echo off
title JavaSkripp Heroku Logs
if not "%1" == "max" start /MAX cmd /c logs max & exit /b
heroku logs -s app -a djs-javaskripp -t