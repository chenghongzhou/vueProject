rm -rf front-client-2017*
time=$(date +%s);
timeStr=$(date -d @${time} +"%Y%m%d%H%M%S")
bb='front-client-'
cc='.tar.gz'
dd=${bb}${timeStr}${cc}
echo ${dd}
cd dist
tar zcvf ${dd} static index.html
mv ${dd} ../






