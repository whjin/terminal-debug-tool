<template>
  <div class="debug-tool-container">
    <div class="debug-tool-wrapper">
      <div class="debug-tool-header">
        <label>服务器IP：</label>
        <input type="text" v-model="serverIp" placeholder="请输入服务器IP" />
        <label>端口：</label>
        <input type="text" v-model="port" placeholder="请输入端口号" />
        <button @click="handleTestApi">测试接口</button>
        <button @click="toggleTestFace">测试人脸接口</button>
        <button @click="getAppVersion">获取服务器APP版本号</button>
        <span class="app-version">{{ appVersion }}</span>
      </div>
      <div class="debug-tool-main">
        <div class="debug-tool-face" v-if="showFaceTest">
          <div class="face-container">
            <div class="face-police">
              <div class="face-box" v-if="policeFaceState">
                <img class="face-image" :src="policeFaceUrl" title="民警人脸照片" alt="民警人脸照片" />
                <img class="face-delete" src="@/assets/images/delete.png" @click="deletePoliceFace" alt="删除民警人脸照片" />
              </div>
              <div v-else class="face-upload">
                <input type="file" accept="image/*" @input="uploadPoliceFace" />
                <img src="@/assets/images/upload.png" alt="上传民警人脸照片" />
                <span>请上传民警人脸照片</span>
              </div>
            </div>
            <div class="face-prisoner">
              <div class="face-box" v-if="prisonerFaceState">
                <img class="face-image" :src="prisonerFaceUrl" title="在押人员人脸照片" alt="在押人员人脸照片" />
                <img class="face-delete" src="@/assets/images/delete.png" @click="deletePrisonerFace" alt="删除在押人员人脸照片" />
              </div>
              <div v-else class="face-upload">
                <input type="file" accept="image/*" @input="uploadPrisonerFace" />
                <img src="@/assets/images/upload.png" alt="上传在押人员人脸照片" />
                <span>请上传在押人员人脸照片</span>
              </div>
            </div>
          </div>
          <div class="face-submit">
            <div class="number-box">
              <div v-if="policeNum">民警编号：{{ policeNum }}</div>
              <div v-if="prisonerNum">在押人员编号：{{ prisonerNum }}</div>
              <div v-if="faceTestState">{{ faceTestContent }}</div>
            </div>
            <div class="button-box">
              <div class="confirm-button" @click="submitFaceTest">确定</div>
              <div class="clear-button" @click="clearFaceTest">清空</div>
            </div>
          </div>
        </div>
        <div class="debug-tool-step step-one">
          <label>【第一步】选择设备：</label>
          <input type="text" v-model="controlCode" placeholder="搜索主机" />
          <button @click="getControlInfo">查询主机列表</button>
          <input type="text" v-model="terminalCode" placeholder="搜索分机" />
          <button @click="getTerminalInfo">查询分机列表</button>
        </div>
        <div class="debug-tool-step">
          <div class="step-header">
            <label>【第二步】</label>
            <button @click="getCommandList">获取指令编号</button>
            <label>输入指令编号：</label>
            <input type="text" v-model="commandCode" placeholder="请输入指令编号" />
            <label>参数(extend)：</label>
            <input type="text" v-model="commandContent" placeholder="请输入参数" />
          </div>
          <div class="step-header">
            <label>【第三步】发送指令：</label>
            <button @click="sendCommand">发送指令</button>
          </div>
          <div class="debug-tool-content">
            <div class="debug-tool-left">
              <div class="command-content">
                <div class="command-item" v-for="(item, index) in commandList" :key="index">
                  <span>{{ `【${item.id}】` }}{{ item.content }}</span>
                </div>
              </div>
            </div>
            <div class="debug-tool-right">
              <div class="debug-tool-table" v-if="controlList.length">
                <div class="table-title">{{ tableTitle }}<span>{{`【所有主机：${searchTotal}】`}}</span><span v-if="selectedNum">{{`【已选主机：${selectedNum}】`}}</span></div>
                <el-table border stripe size="mini" :data="controlList" highlight-current-row max-height="500" :header-cell-class-name="tableHeaderClass" :cell-class-name="tableCellClass" @selection-change="selectControl">
                  <el-table-column align="center" type="selection" width="100" :selectable="controlSelectable"></el-table-column>
                  <el-table-column align="center" label="在线状态" prop="status" width="150"></el-table-column>
                  <el-table-column align="center" label="主机编号" prop="controlCode" width="150"></el-table-column>
                  <el-table-column align="center" label="主机名称" prop="controlName" width="200" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" label="主机IP" prop="controlIp" width="200"></el-table-column>
                  <el-table-column align="center" label="APP版本" prop="version" width="150"></el-table-column>
                  <el-table-column align="center" label="父级主机编号" prop="conParentCode" width="150"></el-table-column>
                  <el-table-column align="center" label="父级主机名称" prop="conParentName" width="150" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" label="单位名称" prop="areaName" width="150" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" label="是否启用" prop="isEnable" width="150"></el-table-column>
                </el-table>
              </div>
              <div class="debug-tool-table" v-if="terminalList.length">
                <div class="table-title">{{ tableTitle }}<span>{{`【所有分机：${searchTotal}】`}}</span><span v-if="selectedNum">{{`【已选分机：${selectedNum}】`}}</span></div>
                <el-table border stripe size="mini" :data="terminalList" highlight-current-row max-height="500" :header-cell-class-name="tableHeaderClass" :cell-class-name="tableCellClass" @selection-change="selectTerminal">
                  <el-table-column align="center" type="selection" width="100" :selectable="terminalSelectable"></el-table-column>
                  <el-table-column align="center" label="在线状态" prop="status" width="150"></el-table-column>
                  <el-table-column align="center" label="分机编号" prop="terminalCode" width="150"></el-table-column>
                  <el-table-column align="center" label="分机名称" prop="terminalName" width="250" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" label="分机IP" prop="terminalIp" width="150"></el-table-column>
                  <el-table-column align="center" label="APP版本" prop="version" width="150"></el-table-column>
                  <el-table-column align="center" label="主机编号" prop="controlCode" width="150"></el-table-column>
                  <el-table-column align="center" label="主机名称" prop="controlName" width="150" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" label="监室ID" prop="roomId" width="200" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" label="监室名称" prop="roomName" width="150"></el-table-column>
                  <el-table-column align="center" label="监区名称" prop="areaName" width="150"></el-table-column>
                  <el-table-column align="center" label="是否启用" prop="isEnable" width="150"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  testApi,
  faceComparTest,
  getUpdateInfo,
  getControlList,
  getTerminalList,
  getCommandInfo,
  sendCommand,
} from "@/api/debugTool";
import config from "@/utils/comlib";

export default {
  name: "DebugTool",
  data () {
    return {
      // 服务器IP
      serverIp: config.serverIp,
      // 端口号
      port: config.port,
      // 主机号
      controlCode: "",
      // 分机号
      terminalCode: "",
      // 命令编号
      commandCode: "",
      // 参数extend
      commandContent: "",
      // 命令编号列表
      commandList: [],
      // 版本号
      appVersion: "",
      // 表格名称
      tableTitle: "",
      // 主机列表
      controlList: [],
      // 分机列表
      terminalList: [],
      // 已选主机编号
      controlNo: "",
      // 已选分机编号
      terminalNo: "",
      // 已选择主分机
      selectedNum: 0,
      // 所有主机
      searchTotal: 0,
      // 人脸测试显隐
      showFaceTest: false,
      // 民警人脸上传状态
      policeFaceState: false,
      // 在押人员人脸上传状态
      prisonerFaceState: false,
      // 民警人脸URL
      policeFaceUrl: "",
      // 在押人员人脸URL
      prisonerFaceUrl: "",
      // 民警编号
      policeNum: "",
      // 在押人员编号
      prisonerNum: "",
      // 人脸比对状态
      faceTestState: false,
      // 人脸比对结果
      faceTestContent: "",
    };
  },
  computed: {
    // 请求地址
    apiUrl () {
      return `http://${this.serverIp}:${this.port}`;
    },
  },
  methods: {
    // 测试接口
    handleTestApi () {
      if (!this.serverIp) {
        this.$message({
          message: "请输入服务器IP",
          type: "warning",
        });
        return;
      }
      if (!this.port) {
        this.$message({
          message: "请输入端口号",
          type: "warning",
        });
        return;
      }
      testApi(this.apiUrl).then(
        (res) => {
          if (res.state.code == "200") {
            this.appVersion = "";
            this.$message({
              message: "接口连接成功",
              type: "success",
              offset: "150",
            });
          }
        },
        (err) => {
          this.appVersion = `请检查服务器IP或端口是否填写正确!`;
          this.$message({
            message: "接口连接失败",
            type: "error",
          });
          this.commandList = [];
          this.controlList = [];
          this.terminalList = [];
        }
      );
    },
    // 测试人脸显隐
    toggleTestFace () {
      this.showFaceTest = !this.showFaceTest;
    },
    // 上传民警人脸照片
    uploadPoliceFace (e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.policeFaceState = true;
        this.policeFaceUrl = e.target.result;
      };
    },
    // 上传在押人员人脸照片
    uploadPrisonerFace (e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.prisonerFaceState = true;
        this.prisonerFaceUrl = e.target.result;
      };
    },
    // 删除民警人脸照片
    deletePoliceFace () {
      this.$confirm("是否删除民警人脸照片？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.policeFaceUrl = "";
          this.policeNum = "";
          this.faceTestContent = "";
          this.faceTestState = false;
          this.policeFaceState = false;
        })
        .catch(() => { });
    },
    // 删除在押人员人脸照片
    deletePrisonerFace () {
      this.$confirm("是否删除在押人员人脸照片？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.prisonerFaceUrl = "";
          this.prisonerNum = "";
          this.faceTestContent = "";
          this.faceTestState = false;
          this.prisonerFaceState = false;
        })
        .catch(() => { });
    },
    // 清空人脸信息
    clearFaceTest () {
      this.policeFaceUrl = "";
      this.policeNum = "";
      this.prisonerFaceUrl = "";
      this.prisonerNum = "";
      this.faceTestContent = "";
      this.faceTestState = false;
      this.policeFaceState = false;
      this.prisonerFaceState = false;
    },
    // 提交人脸测试
    submitFaceTest () {
      let faceUrlList = [this.policeFaceUrl, this.prisonerFaceUrl];
      if (faceUrlList.every((item) => !item)) {
        this.$message({
          message: "请先上传人脸照片！",
          type: "warning",
        });
        return;
      }
      if (this.policeFaceUrl && !this.prisonerFaceUrl) {
        let policeFaceUrl = this.policeFaceUrl.substr(
          this.policeFaceUrl.indexOf(",") + 1
        );
        let params = {
          data: {
            faceType: 0,
            img1: policeFaceUrl,
            img2: "",
          },
        };
        this.handleFaceCompare(0, params);
      } else if (this.prisonerFaceUrl && !this.policeFaceUrl) {
        let prisonerFaceUrl = this.prisonerFaceUrl.substr(
          this.prisonerFaceUrl.indexOf(",") + 1
        );
        let params = {
          data: {
            faceType: 1,
            img1: prisonerFaceUrl,
            img2: "",
          },
        };
        this.handleFaceCompare(1, params);
      } else {
        let policeFaceUrl = this.policeFaceUrl.substr(
          this.policeFaceUrl.indexOf(",") + 1
        );
        let prisonerFaceUrl = this.prisonerFaceUrl.substr(
          this.prisonerFaceUrl.indexOf(",") + 1
        );
        let params = {
          data: {
            faceType: 2,
            img1: policeFaceUrl,
            img2: prisonerFaceUrl,
          },
        };
        this.handleFaceCompare(2, params);
      }
    },
    // 人脸测试公共方法
    handleFaceCompare (type, params) {
      faceComparTest(this.apiUrl, params)
        .then((res) => {
          if (res.state.code == "200") {
            if (type == 2) {
              this.policeNum = "";
              this.prisonerNum = "";
              this.faceTestState = true;
              if (res.data.score >= 0.8) {
                this.faceTestContent = `人脸比对成功！比对值：${res.data.score}`;
              } else {
                this.faceTestContent = `人脸比对失败！比对值：${res.data.score}`;
              }
            } else {
              if (res.data.hasOwnProperty("rybh")) {
                switch (type) {
                  case 0:
                    this.policeNum = res.data.rybh;
                    break;
                  case 1:
                    this.prisonerNum = res.data.rybh;
                    break;
                }
              } else {
                this.$message({
                  message: "无该人员！",
                  type: "warning",
                });
              }
            }
          }
        })
        .catch(() => {
          this.$message({
            message: "无该人员！",
            type: "warning",
          });
        });
    },
    // 获取服务器APP版本号
    getAppVersion () {
      getUpdateInfo(this.apiUrl).then(
        (res) => {
          if (res.state.code == "200") {
            if (Object.keys(res.data).length) {
              let controlVersionName = res.data.control ? `【主机：V${res.data.control.versionName}】` : "";
              let terminalVersionName = res.data.terminal ? `【仓内屏：V${res.data.terminal.versionName}】` : "";
              let managerVersionName = res.data.manager ? `【仓外屏：V${res.data.manager.versionName}】` : "";
              this.appVersion = `${controlVersionName}${terminalVersionName}${managerVersionName}`;
            } else {
              this.appVersion = "暂无数据";
            }
          }
        },
        (err) => {
          this.appVersion = `请检查服务器IP或端口是否填写正确!`;
          this.commandList = [];
          this.controlList = [];
          this.terminalList = [];
        }
      );
    },
    // 获取主机列表
    getControlInfo () {
      this.controlNo = "";
      this.terminalNo = "";
      this.selectedNum = 0;
      this.searchTotal = 0;
      this.controlList = [];
      this.terminalList = [];
      let params = {
        data: {
          keyword: this.controlCode,
        },
      };
      getControlList(this.apiUrl, params).then((res) => {
        if (res.state.code == "200") {
          this.tableTitle = "主机列表";
          this.searchTotal = res.data.length;
          let result = res.data;
          if (result.length) {
            result.map((item) => {
              item.status = item.status ? "在线" : "离线";
              item.isEnable = item.isEnable ? "启用" : "未启用";
            });
          }
          this.controlList = result;
        }
      });
    },
    // 获取分机列表
    getTerminalInfo () {
      this.controlNo = "";
      this.terminalNo = "";
      this.selectedNum = 0;
      this.searchTotal = 0;
      this.controlList = [];
      this.terminalList = [];
      let params = {
        data: {
          keyword: this.terminalCode,
        },
      };
      getTerminalList(this.apiUrl, params).then((res) => {
        if (res.state.code == "200") {
          this.tableTitle = "分机列表";
          this.searchTotal = res.data.length;
          let result = res.data;
          if (result.length) {
            result.map((item) => {
              item.status = item.status ? "在线" : "离线";
              item.isEnable = item.isEnable ? "启用" : "未启用";
            });
          }
          this.terminalList = result;
        }
      });
    },
    // 获取命令编号
    getCommandList () {
      this.commandList = [];
      getCommandInfo(this.apiUrl).then(
        (res) => {
          if (res.state.code == "200") {
            this.commandList = res.data;
          }
        },
        (err) => {
          this.$message({
            message: "请检查服务器IP或端口是否填写正确!",
            type: "error",
          });
        }
      );
    },
    // 主机在线可选
    controlSelectable (row) {
      return row.status == "在线";
    },
    // 分机在线可选
    terminalSelectable (row) {
      return row.status == "在线";
    },
    // 选择主机列表
    selectControl (list) {
      this.selectedNum = list.length;
      this.controlNo = list
        .map((item) => {
          return item.controlCode;
        })
        .join(",");
    },
    // 选择分机列表
    selectTerminal (list) {
      this.selectedNum = list.length;
      this.terminalNo = list
        .map((item) => {
          return item.terminalCode;
        })
        .join(",");
    },
    // 发送指令
    sendCommand () {
      if (!this.controlList.length && !this.terminalList.length) {
        this.$message({
          message: "请先查询设备列表",
          type: "warning",
        });
        return;
      }
      if (!this.commandCode) {
        this.$message({
          message: "请输入命令编号",
          type: "warning",
        });
        return;
      }
      if (!!this.controlList.length && !this.controlNo) {
        this.$message({
          message: "请选择主机列表",
          type: "warning",
        });
        return;
      }
      if (!!this.terminalList.length && !this.terminalNo) {
        this.$message({
          message: "请选择分机列表",
          type: "warning",
        });
        return;
      }
      if (!!this.controlList.length && !!this.controlNo) {
        let params = {
          data: {
            command: this.commandCode,
            devNo: this.controlNo,
            extend: this.commandContent,
          },
        };
        sendCommand(this.apiUrl, params).then((res) => {
          if (res.state.code == "200") {
            this.$message({
              message: "指令发送成功",
              type: "success",
            });
          }
        });
      }
      if (!!this.terminalList.length && !!this.terminalNo) {
        let params = {
          data: {
            command: this.commandCode,
            devNo: this.terminalNo,
            extend: this.commandContent,
          },
        };
        sendCommand(this.apiUrl, params).then((res) => {
          if (res.state.code == "200") {
            this.$message({
              message: "指令发送成功",
              type: "success",
            });
          }
        });
      }
    },
    // 表头类名
    tableHeaderClass (list) {
      return "table-header";
    },
    // 表格行类名
    tableCellClass (list) {
      if (list.row.status == "在线") {
        return "cell-online";
      }
      if (list.row.netStatus == 0) {
        return "net-offline";
      }
      return "table-cell";
    },
  },
};
</script>

<style lang="less">
@import '../assets/less/index.less';
</style>
