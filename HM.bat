@echo off
title JavaSkripp Heroku Manager
if not "%1" == "max" start /MAX cmd /c HM max & exit /b

:loop
cls
echo.
echo. Commands:   restart/r, logs/l, notif/n
echo.
echo. User: && call heroku whoami
echo.
set /p "args= >> "

if /i %args%==logs (
    title JavaSkripp Heroku - Logs
    echo.
    call heroku logs -s app -a djs-javaskripp -t
)

if /i %args%==l (
    title JavaSkripp Heroku - Logs
    echo.
    call heroku logs -s app -a djs-javaskripp -t
)

if /i %args%==restart (
    title JavaSkripp Heroku - Restart
    echo.
    call heroku ps:restart -a djs-javaskripp
    echo.
    echo Press any key to close... && pause >nul && pause >nul
)

if /i %args%==r (
    title JavaSkripp Heroku - Restart
    echo.
    call heroku ps:restart -a djs-javaskripp
    echo.
    echo Press any key to close... && pause >nul
)

if /i %args%==notif (
    title JavaSkripp Heroku - Notifications
    echo.
    call heroku notifications -a djs-javaskripp
    echo.
    echo Press any key to close... && pause >nul
)

if /i %args%==n (
    title JavaSkripp Heroku - Notifications
    echo.
    call heroku notifications -a djs-javaskripp
    echo.
    echo Press any key to close... && pause >nul
)

goto loop