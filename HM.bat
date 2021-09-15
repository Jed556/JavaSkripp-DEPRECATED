@echo off
title JavaSkripp Heroku Manager
if not "%1" == "max" start /MAX cmd /c HM max & exit /b

:ask
echo.
echo. Commands:   restart/r, logs/l
echo.
set /p "args= >> "

if /i %args%==logs (
    title JavaSkripp Heroku - Logs
    echo.
    heroku logs -s app -a djs-javaskripp -t
)

if /i %args%==l (
    title JavaSkripp Heroku - Logs
    echo.
    heroku logs -s app -a djs-javaskripp -t
)

if /i %args%==restart (
    title JavaSkripp Heroku - Restart
    echo.
    heroku ps:restart -a djs-javaskripp
    echo Press any key to close...
    pause >nul
)

if /i %args%==r (
    title JavaSkripp Heroku - Restart
    echo.
    heroku ps:restart -a djs-javaskripp
    echo Press any key to close...
    pause >nul
)