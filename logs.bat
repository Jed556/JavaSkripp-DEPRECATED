@echo off
if not "%1" == "max" start /MAX cmd /c %0 max & exit /b
title JavaSkripp Heroku Logs
heroku logs -s app -a djsbot-556 -t