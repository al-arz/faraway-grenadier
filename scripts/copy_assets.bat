@echo off

REM Remove dist/assets directory
DEL /S "%CD%\dist\assets"

REM Remove index.html
DEL /S "%CD%\dist\index.html"

MKDIR "%CD%\dist\assets"

REM Copy assets
xcopy /E /I /Y "%CD%\src\assets\" "%CD%\dist\assets"

REM Copy index.html
xcopy /Y "%CD%\src\index.html" "%CD%\dist\index.html"
