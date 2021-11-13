@echo off
REM Install Heroku CLI and install plugins...
REM heroku plugins:install heroku-builds
REM Pass in "wt" to run in windows terminal

REM For windows terminal with custom profile
if /i not "%1" == "wt" goto cmd
start /MAX wt -p "JavaSkripp" cmd /k %~dpn0 max & exit /b
goto start

:cmd
REM For windows command prompt
if not "%1" == "max" start /MAX cmd /c %~dpn0 max & exit /b

:start
REM heroku plugins:install heroku-builds
set app=djs-javaskripp

:loop
title JavaSkripp Heroku Manager
cls
echo.
echo. Heroku Manager  By: Jed556
echo. Commands:   restart/r,  logs/l,  builds/b,  errors/e,  config/c,  notif/n,  info/i
echo.
set /p "args= >> "

if /i %args%==logs (
    title JavaSkripp Heroku - Logs
    echo.
    call heroku logs -s app -a %app% -t
    goto loop
)

if /i %args%==l (
    title JavaSkripp Heroku - Logs
    echo.
    call heroku logs -s app -a %app% -t
    goto loop
)

if /i %args%==restart (
    title JavaSkripp Heroku - Restart
    echo.
    call heroku ps:restart -a %app%
    echo.
    echo Press any key to close... && pause >nul && pause >nul
    goto loop
)

if /i %args%==r (
    title JavaSkripp Heroku - Restart
    echo.
    call heroku ps:restart -a %app%
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

if /i %args%==notif (
    title Loading Notifications
    echo.
    call heroku notifications -a %app%
    title JavaSkripp Heroku - Notifications
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

if /i %args%==n (
    title Loading Notifications
    echo.
    call heroku notifications -a %app%
    title JavaSkripp Heroku - Notifications
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

if /i %args%==info (
    title Loading Info
    echo.
    call heroku apps:info -a %app%
    echo.
    call heroku ps -a %app%
    echo.
    call heroku buildpacks -a %app%
    echo.
    call heroku domains -a %app%
    echo.
    call heroku certs:info -a %app%
    echo.
    echo Maintenance:
    call heroku maintenance -a %app%
    title JavaSkripp Heroku - Info
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

if /i %args%==i (
    title Loading Info
    echo.
    call heroku apps:info -a %app%
    echo.
    call heroku ps -a %app%
    echo.
    call heroku buildpacks -a %app%
    echo.
    call heroku domains -a %app%
    echo.
    call heroku certs:info -a %app%
    echo.
    echo Maintenance:
    call heroku maintenance -a %app%
    title JavaSkripp Heroku - Info
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

if /i %args%==builds (
    title Loading Builds
    echo.
    call heroku builds:info -a %app%
    echo.
    call heroku builds -a %app%
    title JavaSkripp Heroku - Builds
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

if /i %args%==b (
    title Loading Builds
    echo.
    call heroku builds:info -a %app%
    echo.
    call heroku builds -a %app%
    title JavaSkripp Heroku - Builds
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

if /i %args%==errors (
    title Loading Errors
    echo.
    call heroku apps:errors -a %app%
    title JavaSkripp Heroku - Errors
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

if /i %args%==e (
    title Loading Errors
    echo.
    call heroku apps:errors -a %app%
    title JavaSkripp Heroku - Errors
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

if /i %args%==config (
    title Loading Config Vars
    echo.
    call heroku config -a %app%
    title JavaSkripp Heroku - Config Vars
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

if /i %args%==c (
    title Loading Config Vars
    echo.
    call heroku config -a %app%
    title JavaSkripp Heroku - Config Vars
    echo.
    echo Press any key to close... && pause >nul
    goto loop
)

echo.
title JavaSkripp Heroku - Unknown Command
echo Unknown command
echo Press any key to close... && pause >nul
goto loop