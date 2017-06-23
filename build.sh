#!/bin/sh
STC_PATH="/home/q/php/STC"
path=`dirname $0`;
first=${path:0:1};
if [[ $first != '/' ]];then
    path=$(pwd);
fi
if [ -d ${path}"/output" ];then
  rm -rf ${path}"/output";
fi
mkdir ${path}"/output";
if [ ! -f ${path}"/config.php" ];then
  cp $STC_PATH/config/config.php ${path};
fi
if [ -f /usr/local/bin/php ];then
    PHP="/usr/local/bin/php";
else
    PHP="/usr/bin/php";
fi
$PHP $STC_PATH/index.php ${path} test $1;
if [ -f ${path}"/stc.error.log" ]; then
    rm -rf ${path}"/stc.error.log";
    exit 1;
fi
#---------------------------
# 将编译后的代码放置到线上环境映射目录下
rsync -r ${path}"/output/src/application/views/scripts/" "src/application/views/compiled_tpl/"
#--------------------------

#---------------------------
# 将燕尾服无法分析的第三方库（如百度ueditor）替换为原来的路径

node tools/changeFile/changeFile.js
#--------------------------