#!/bin/sh

set -e

CORE_SWF=$1
FFDEC_DIR=$2
TEMP_CORE=/tmp/decoded.swf
TEMP_CORE_DECOMPRESSED=/tmp/decoded-decompressed.swf

python ./core-decode.py $CORE_SWF $TEMP_CORE
java -jar $FFDEC_DIR/ffdec.jar -decompress $TEMP_CORE $TEMP_CORE_DECOMPRESSED
java -jar $FFDEC_DIR/ffdec.jar -importScript $TEMP_CORE_DECOMPRESSED ../bin/Core.swf ./as3-import

rm $TEMP_CORE
rm $TEMP_CORE_DECOMPRESSED
