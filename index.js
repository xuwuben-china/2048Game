var _2048 = (function(window,document){
	/*
		Game2048 Created At :2018.2.10;
		Author:xuwuben
		Email:1664886636@qq.com
		Versions:1.0

	*/
	//获取窗口的宽高
	function getWindowSize(){
		return {
			w: document.documentElement.clientWidth,
			h: document.documentElement.clientHeight
		}
	}
	//设置每个li的宽高
	function setItemSize(winW, size, item){
		var itemSize = 0;
		if(winW > 640){return}
		itemSize = (winW - 65 -size*5) / size + "px";
		item.style.width = itemSize;
		item.style.height = itemSize;
		item.style.lineHeight = itemSize;

	}
	//生成2048游戏的初始界面
	function initGui(matrix){
		var root = document.createElement("div"),
			ul = null,
			len = matrix.length,
			list = [],
			item = null,
			winW = getWindowSize().w;
		for(var i=0; i<len; i++){
			list[i] = [];
			ul = document.createElement("ul");
			for(var j=0; j<len; j++){
				item = document.createElement("li");
				setItemSize(winW, len, item);
				list[i][j] = item;
				ul.appendChild(item);
			}
			root.appendChild(ul);
		}
		return {
			list: list,
			root: root
		}
	}
	//生成随机数
	function random4_2(){
		return Math.random() > 0.5 ? 4 : 2; 
	}
	//填充生成的随机数 随机取出一个空的坐标填充数字
	function fillNumber(matrix, isInit){
		Game.index++;
		var list = [], x, y, item, len = matrix.length,
		times =  isInit ? len - 2 : 1;
		for(var i=0; i<times; i++){
			item = findEmptyItemCoordnate(matrix);
			if(item && item.length == 2){
				x = item[0];
				y = item[1];
				matrix[x][y] = random4_2();
			}
		}
	}
	//找到所有可以填充数字的位置,随机返回一个可以填充数字的位置
	function findEmptyItemCoordnate(matrix){
		var emptylen = 0, flag = 0, emptyArr = [], len = matrix.length;
		for(var i=0; i<len; i++){
			for(var j=0; j<len; j++){
				if(matrix[i][j] === 0){
					emptyArr.push([i,j])
				}
			}
		}
		emptylen = emptyArr.length;
		if(emptylen===0){
			return [];
		}
		flag = Math.floor(Math.random()*emptylen);
		return emptyArr[flag];
	}
	//找到数字后添加到对应的li里
	function drawGUI(matrix,list){
		var len = matrix.length, item = null;
		for(var i=0; i<len; i++){
			for (var j =0; j < len; j++) {
				color = createColorByNumber(matrix[i][j])
				item = list[i][j];
				item.innerHTML = matrix[i][j] === 0? "" : matrix[i][j];
				item.style.backgroundColor = color.bgColor;
				item.style.color = color.color;
			}
		}
	}
	//根据数字生成颜色
	function createColorByNumber(number){
		var flag = 0;
		var color = {
			'0':  {bgColor: '#cbc2b2', color: '#333'},
            '1':  {bgColor: '#ebe4d9', color: '#333'},
            '2':  {bgColor: '#eedec7', color: '#333'},
            '3':  {bgColor: '#f39763', color: '#fff'},
            '4':  {bgColor: '#f29c5c', color: '#fff'},
            '5':  {bgColor: '#ef8161', color: '#fff'},
            '6':  {bgColor: '#f16432', color: '#fff'},
            '7':  {bgColor: '#eed170', color: '#fff'},
            '8':  {bgColor: '#edce5d', color: '#fff'},
            '9':  {bgColor: '#edc850', color: '#fff'},
            '10': {bgColor: '#edc53f', color: '#fff'},
            '11': {bgColor: '#edc22e', color: '#fff'},
            '12': {bgColor: '#b884ac', color: '#fff'},
            '13': {bgColor: '#b06ca9', color: '#fff'},
            '14': {bgColor: '#7f3d7a', color: '#fff'},
            '15': {bgColor: '#6158b1', color: '#fff'},
            '16': {bgColor: '#3a337b', color: '#fff'},
            '17': {bgColor: '#0f4965', color: '#fff'},
            '18': {bgColor: '#666', color: '#fff'},
            '19': {bgColor: '#333', color: '#fff'},
            '20': {bgColor: '#000', color: '#fff'}
		}
		if(number){
			flag = Math.log2(number);
		}
		return color[String(flag)];
	}
	//添加事件监听
	function registerEvent(callback){
		function keyEventHadlar(e){
			e = e || window.event;
			var code = e.keyCode;
			callback.call(this, code);
		}
		window.addEventListener("keydown", keyEventHadlar)
		return keyEventHadlar;
	}
	//判断能不能移动
	function canGo(matrix, keyWord){
		var len = matrix.length;
		//可以左移
		function canGoLeft(matrix){
			for(var i=0; i<len; i++){
				for(var j=0; j<len - 1; j++){
					if(matrix[i][j] === 0 && matrix[i][j + 1] > 0){
						return true;
					}
					if(matrix[i][j + 1] > 0 && matrix[i][j] == matrix[i][j + 1]){
						return true;
					}
				}
			} 
			return false;
		}
		//可以右移
		function canGoRight(matrix){
			for(var i=0; i<len; i++){
				for(var j=0; j<len-1; j++){
					if(matrix[i][j + 1] === 0 && matrix[i][j] > 0){
						return true;
					}
					if(matrix[i][j + 1] > 0 && matrix[i][j] == matrix[i][j + 1]){
						return true;
					}
				}
			}
			return false;
		}
		//可以上移
		function canGoUp(matrix){
			for(var i=0; i<len; i++){
				for(var j=0; j<len-1; j++){
					if(matrix[j][i] === 0 && matrix[j + 1][i] > 0){
						return true;
					}
					if(matrix[j + 1][i] > 0 && matrix[j][i] == matrix[j + 1][i]){
						return true;
					}
				}
			}
			return false;
		}
		//可以下移
		function canGoDown(matrix){
			for(var i=0; i<len; i++){
				for(var j=0; j<len-1; j++){
					if(matrix[j + 1][i] === 0 && matrix[j][i] > 0){
						return true;
					}
					if(matrix[j][i] > 0 && matrix[j][i] == matrix[j + 1][i]){
						return true;
					}
				}
			}
			return false;
		}
		if(keyWord){
			switch(keyWord){
			case "left":
				return canGoLeft(matrix);
				break;
			case "right":
				return canGoRight(matrix);
				break;
			case "up":
				return canGoUp(matrix);
				break;
			case "down":
				return canGoDown(matrix);
				break;

			}
		}
		
	}
	//取出不可以填充的元素，即填充了数字的元素
	function getFilledItem(matrix){
		var len = matrix.length, filled = [];
		for(var i=0; i<len; i++){
			for(j=0; j<len; j++){
				if(matrix[i][j] > 0){
					filled.push({
						flag: [i, j],
						value: matrix[i][j]
					})
				}
			}
		}
		return filled;
	}
	//移动
	function move(matrix, keyWord){
		var len = matrix.length,
			line = [],
			lineLength = 0,
		    filled = getFilledItem(matrix);
		if(canGo(matrix, keyWord)){
			switch(keyWord){
				case "left":
					for(var i=0; i<len; i++){
						line = filled.filter(function(item){
							return item.flag[0] === i;
						})
						lineLength = line.length;
						for(var j=0; j<lineLength; j++){
							matrix[line[j].flag[0]][line[j].flag[1]] = 0;
							matrix[i][j] = line[j].value;
						}
					}
					break;
				case "right":
					for(var i=0; i<len; i++){
						line = filled.filter(function(item){
							return item.flag[0] === i;
						})
						lineLength = line.length;
						for(var j=0; j<lineLength; j++){
							matrix[line[lineLength - j - 1].flag[0]][line[lineLength - j - 1].flag[1]] = 0;
							matrix[i][len - j - 1] = line[lineLength - j - 1].value;
						}
					}
					break;
				case "up":
					for(var i=0; i<len; i++){
						line = filled.filter(function(item){
							return item.flag[1] === i;
						})
						lineLength = line.length;
						for(var j=0; j<lineLength; j++){
							matrix[line[j].flag[0]][line[j].flag[1]] = 0;
							matrix[j][i] = line[j].value;
						}
					}
					break;
				case "down":
					for(var i=0; i<len; i++){
						line = filled.filter(function(item){
							return item.flag[1] == i;
						})
						lineLength = line.length;
						for(var j=0; j<lineLength; j++){
							matrix[line[lineLength - j - 1].flag[0]][line[lineLength - j - 1].flag[1]] = 0;
							matrix[len - j - 1][i] = line[lineLength - j - 1].value;
						}
					}
					break;
			}
		}
	}
	//合并
	function merge(matrix, keyWord, callback){
		var len = matrix.length, singleStepScore = 0;
		switch (keyWord){
			case "left":
				for(var i=0; i<len; i++){
					for(var j=0; j<len - 1; j++){
						if(matrix[i][j] > 0 && matrix[i][j] == matrix[i][j + 1]){
							matrix[i][j] *= 2 ;
							singleStepScore += matrix[i][j];
							matrix[i][j + 1] = 0;
						}
					}
				}
				break;
			case "right":
				for(var i=0; i<len; i++){
					for(var j=0; j<len - 1; j++){
						if(matrix[i][j + 1] > 0 && matrix[i][j] == matrix[i][j + 1]){
							matrix[i][j + 1] *= 2 ;
							singleStepScore += matrix[i][j + 1];
							matrix[i][j] = 0;
						}
					}
				}
				break;
			case "up":
				for(var i=0; i<len; i++){
					for(var j=0; j<len - 1; j++){
						if(matrix[j][i] > 0 && matrix[j][i] == matrix[j + 1][i]){
							matrix[j][i] *= 2 ;
							singleStepScore += matrix[j + 1][i];
							matrix[j + 1][i] = 0;
						}
					}
				}
				break;
			case "down":
				for(var i=0; i<len; i++){
					for(var j=0; j<len - 1; j++){
						if(matrix[j + 1][i] > 0 && matrix[j][i] == matrix[j + 1][i]){
							matrix[j + 1][i] *= 2 ;
							singleStepScore += matrix[j][i];
							matrix[j][i] = 0;
						}
					}
				}
				break;
		}
		//积分
		Game.score += singleStepScore;
		Game.scoreElement.innerHTML = Game.score;
		//保存最高分
		saveMaxScore(Game.size, Game.score, Game.maxScore)
		showMaxScore(Game.maxScoreElement, Game.score, Game.maxScore);
		fillNumber(matrix, Game.isInit);
	}
	//本地保存分数
	function saveMaxScore(size, score, maxScore){
		if(score > maxScore){
			window.localStorage.setItem("maxScore---" + size,score);
		}
	}
	//获取本地分数
	function getMaxScoreFromLocalStorage(size){
		return window.localStorage.getItem("maxScore---" + size)
	}
	//显示最高分
	function showMaxScore(ele, score, maxScore){
		return ele.innerHTML = score > maxScore ? score : maxScore;

	}
	//获取最大数值
	function getMax(matrix){
		var max = 0, len = matrix.length;
		for(var i=0; i<len; i++){
			for(var j=0; j<len; j++){
				if(max < matrix[i][j]){
					max = matrix[i][j];
				}
			}
		}
		return max;
	}
	var Game = {
		//左键键码
		ARROW_LEFT: 37,
		//上键键码
		ARROW_UP: 38,
		//右键键码
		ARROW_RIGHT: 39,
		//下键键码
		ARROW_DOWN: 40,
		//初始的分数
		score: 0,
		//初始的盒子大小（尺寸）
		size: 4,
		//矩阵数据
		data: [],
		//最高分
		maxScore: 0,
		//是否是初始游戏
		isInit: true,
		//是否继续游戏
		isContinueGame: true,
		//是否不能操作
		isStop: false,
		index: 0,
		//初始化游戏函数
		//config 是使用_2048时需要的一些配置信息
		init:function(config){
			//gui 存放布局信息
			var gui = {};
			var self = this;
			//2048 游戏总容器
			this.wrapper = config.wrapper;
			//2048 游戏内容容器
			this.content = config.content;
			//2048 游戏得分容器
			this.scoreElement = config.score;
			//2048 游戏最高分容器
			this.maxScoreElement = config.maxScore;
			//2048 游戏盒子大小，有默认值，默认是4表示4*4的结构
			this.size = config.size || this.size,
			// 保存配置信息
			this.config = config;
			//生成二维矩阵
			for(var i=0; i<this.size; i++){
				this.data[i] = [];
				for(var j=0; j<this.size; j++){
					this.data[i][j] = 0;
				}
			}
			this.maxScore = getMaxScoreFromLocalStorage(this.size);
			gui = initGui(this.data);
			this.root = gui.root;
			this.elements = gui.list;
			try{
				if(getWindowSize().w > 640){
					this.wrapper.style.width = 45 + this.size*5 + 60*this.size + "px";
				}
				//把创建的元素放到content中
				this.maxScoreElement.innerHTML = this.maxScore;
				this.content.appendChild(gui.root);
				return this;
			} catch (e){
				throw new Error(e);
			}
		},
		//游戏开始
		start: function(){
			var self = this;
			var isGameOver = canGo(this.data, "left") || canGo(this.data, "right") || canGo(this.data, "up") || canGo(this.data, "down");
			fillNumber(this.data, this.isInit);
			this.isInit = false;
			drawGUI(this.data,this.elements);
			var handler = registerEvent(function(code){
				if(!self.isStop){
					switch(code){
						case self.ARROW_LEFT:
							move(self.data, "left");
							merge(self.data, "left");
							break;
						case self.ARROW_UP:
							move(self.data, "up");
							merge(self.data, "up");
							break;
						case self.ARROW_DOWN:
							move(self.data, "down");
							merge(self.data, "down" );
							break;
						case self.ARROW_RIGHT:
							move(self.data, "right");
							merge(self.data, "right");
							break;
					}
				}
				//游戏失败
				var isGameOver = canGo(self.data, "left") || canGo(self.data, "right") || canGo(self.data, "up") || canGo(self.data, "down");
				if(!isGameOver){
					window.removeEventListener("keydown", handler);
					self.gameOver(self.content, self.scoreElement, function(ele){
						self.content.removeChild(ele);
						self.isInit = true;
						self.init(self.config).start();
					})
				}
				//游戏胜利
				if(self.isContinueGame){
					if(getMax(self.data) === 2048){
						setTimeout(function(){
							self.gameWin(self.content, self.scoreElement, function(ele){
								window.removeEventListener("keydown", handler);
								self.content.removeChild(ele);
								self.init(self.config).start();
							})
						}, 200)
					}
				}
				drawGUI(self.data, self.elements);
			})
			return this;
		},
		//游戏结束
		gameOver: function(rootEle, scoreElement, callback){
			if(!this.isStop){
				var wrap = document.createElement("div"),
					h2 = document.createElement("h2"),
					restartBtn = document.createElement("button");
				var self = this;
				self.isStop = true;
				wrap.className = "gameover-wrap";
				h2.className = "gameover-title";
				restartBtn.className = "gameover-restart";
				h2.innerHTML = "游戏结束";
				restartBtn.innerHTML = "重新开始";
				wrap.appendChild(h2);
				wrap.appendChild(restartBtn);
				rootEle.appendChild(wrap);
				restartBtn.addEventListener("click",function(){
					scoreElement.innerHTML = 0;
					self.score = 0;
					rootEle.removeChild(wrap);
					callback&&callback.call(this, self.root);
					self.isContinueGame = true;
					self.isStop = false;
				})
			}
			return this;
		},
		//游戏胜利
		gameWin: function(rootEle, scoreElement, callback){
			if(!this.isStop){
				var wrap = document.createElement("div"),
					h2 = document.createElement("h2"),
					restartBtn = document.createElement("button"),
					continueBtn = document.createElement("button");
				var self = this;
				self.isStop = true;
				wrap.className = "gamewin-wrap";
				h2.className = "gamewin-title";
				restartBtn.className = "gamewin-restart";
				continueBtn.className = "gamewin-continue";
				h2.innerHTML = "游戏胜利";
				restartBtn.innerHTML = "重新开始";
				continueBtn.innerHTML = "继续游戏";
				wrap.appendChild(h2);
				wrap.appendChild(restartBtn);
				wrap.appendChild(continueBtn);
				rootEle.appendChild(wrap);
				restartBtn.addEventListener("click",function(){
					scoreElement.innerHTML = 0;
					self.score = 0;
					self.isInit = true;
					rootEle.removeChild(wrap);
					callback&&callback.call(this, self.root);
					self.isContinueGame = true;
					self.isStop = false;
				})
				continueBtn.addEventListener("click",function(){
					rootEle.removeChild(wrap);
					self.isContinueGame = false;
					self.isStop = false;
				})
			}
			return this;
		}

	}
	return {
		Game: Game
	}
})(window,document)