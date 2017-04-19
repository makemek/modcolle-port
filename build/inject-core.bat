@echo off

set CORE_SWF=%1
set FFDEC_DIR=%2
set TEMP_CORE=%temp%\decoded.swf
set TEMP_CORE_DECOMPRESSED=%temp%\decoded-decompressed.swf

python .\core-decode.py %CORE_SWF% %TEMP_CORE%
java -jar %FFDEC_DIR%\ffdec.jar -decompress %TEMP_CORE% %TEMP_CORE_DECOMPRESSED%
java -jar %FFDEC_DIR%\ffdec.jar -importScript %TEMP_CORE_DECOMPRESSED% ..\bin\Core.swf .\as3-import

del %TEMP_CORE%
del %TEMP_CORE_DECOMPRESSED%
