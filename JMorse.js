let KRChar = {'ㄱ':'0100','ㄴ':'0010','ㄷ':'1000','ㄹ':'0001','ㅁ':'11','ㅂ':'011',	'ㅅ':'110','ㅇ':'101','ㅈ':'0110','ㅊ':'1010','ㅋ':'1001','ㅌ':'1100','ㅍ':'111','ㅎ':'0111','ㅏ':'0','ㅑ':'00','ㅓ':'1','ㅕ':'000','ㅗ':'01','ㅛ':'10','ㅜ':'0000','ㅠ':'010','ㅡ':'100','ㅣ':'001','ㅐ':'1101','ㅔ':'1011'},
	ENChar = { 'A':'01', 'B':'1000', 'C':'1010','D':'100', 'E':'0', 'F':'0010','G':'110', 'H':'0000', 'I':'00','J':'0111', 'K':'101', 'L':'0100','M':'11', 'N':'10', 'O':'111','P':'0110', 'Q':'1101', 'R':'010','S':'000', 'T':'1', 'U':'001','V':'0001', 'W':'011', 'X':'1001','Y':'1011', 'Z':'1100'},
	NumChar = {	'1':'01111','2':'00111','3':'00011','4':'00001','5':'00000','6':'10000','7':'11000','8':'11100','9':'11110','0':'11111',},
	SpecialChar = {'.':'010101',',':'110011','?':'001100','/':'10010','+':'01010','-':'100001','=':'10001',':':'111000',';':'101010','(':'10110',')':'101101','"':'010010',"'":'011110','@':'011010','　':'',},
	CodeType = { 'KR':KRChar , 'EN':ENChar, 'NUM':NumChar, 'SPChar':SpecialChar };

let cCho  = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
    cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ],
    cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
    COMPLEX = {'ㄲ':'ㄱㄱ', 'ㄳ':'ㄱㅅ', 'ㄵ':'ㄴㅈ','ㄶ':'ㄴㅎ', 'ㄸ':'ㄷㄷ', 'ㅉ':'ㅈㅈ',	'ㄺ':'ㄹㄱ', 'ㄻ':'ㄹㅁ', 'ㄼ':'ㄹㅂ','ㄽ':'ㄹㅅ', 'ㄾ':'ㄹㅌ', 'ㄿ':'ㄹㅍ','ㅀ':'ㄹㅎ', 'ㅃ':'ㅂㅂ', 'ㅄ':'ㅂㅅ','ㅆ':'ㅅㅅ',	'ㅘ':'ㅗㅏ', 'ㅙ':'ㅗㅐ','ㅚ':'ㅗㅣ',	'ㅝ':'ㅜㅓ', 'ㅞ':'ㅜㅔ','ㅟ':'ㅜㅣ',	'ㅢ':'ㅡㅣ', 'ㅒ':'ㅑㅣ','ㅖ':'ㅕㅣ',};

let pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; 
let pattern_eng = /[a-zA-Z]/;
let pattern_num = /[0-9]/;
var pattern_special = /[~!#$%^&*|\\　]/gi;


String.prototype.toMorseChars = function() {

    let chars = StringDetach(this); //문자열 분리
    let Encode = MS_EnCoder(chars); //모스부호 인코딩

    return Encode;
}


String.prototype.unMorseChars = function(type) {

	// 문자열 공백제거
	var str = this.replace(/ /gi, ""), 
        chars = MS_DeCoder(type, str),
        cnt = chars.length,
        cho, jung, jong;

    //한글 조합
    var recipe = {
    	'cho':'',
    	'jung':'',
    	'jong':'',
    	'prev':'',
    	'complex':'',
    	'MixStr':'',
    };

    // 출력 값
    var mixChar = [],
    	mixleng = '';

    for(var i = 0; i < cnt; i++){
    	recipe.cho = ChoUniCode(chars[i]);	//초,중,종 모두대입해 초성,종성,종성인지 확인.
    	recipe.jung = JungUniCode(chars[i]);
    	recipe.jong = JongUniCode(chars[i]);

    	mixChar.push(chars[i]);  // 현재 값 추가
    	mixleng = mixChar.length;// 변경된 배열길이 체크

    	// console.log(recipe, chars[i],'\n', mixChar,'\n');

    	var CPLX = ComplexChar(recipe.prev, chars[i]); // Complex
    	if(CPLX){ 
    		if(JongUniCode(recipe.complex) > 0 && recipe.MixStr){ 
    			// 대기조합 + 합성종성 + 초성 일때 (대기조합 + 합성종성)문자확정 
				var complete = String.fromCharCode(recipe.MixStr.charCodeAt()+JongUniCode(recipe.complex));
				mixChar.splice(mixleng-3, 3);
				mixChar.push(complete);
				mixChar.push(chars[i]);
				recipe.complex = ''; // 문자 확정시 초기화
				recipe.MixStr = '';	 // 문자 확정시 초기화

    		} else if (JongUniCode(recipe.complex) <= 0 ){
    			// 합성초성 + 합성초성 조합 일때 선조합 분해 후조합 등록

    			// 종성은 아니지만 조합이 있을때.
    			if(recipe.complex){
	   				var detach = COMPLEX[recipe.complex];
   					jong = JongUniCode(detach.charAt(0));

   					if(recipe.MixStr && jong > -1 ){
   						var complete = String.fromCharCode(recipe.MixStr.charCodeAt()+jong);
   						mixChar.splice(mixleng-3, 3);
   						mixChar.push(complete);
   						mixChar.push(CPLX);
   						recipe.MixStr = '';
   					}
   					jong = 0;

    			} else {
    				mixChar.splice(mixleng-2, 2);
	   				mixChar.push(CPLX);
	    			recipe.complex = CPLX;
    			}   			

    		} else {
    			if(recipe.complex && JungUniCode(CPLX) === -1 ){
    				var detach = COMPLEX[recipe.complex];
    				mixChar.splice(mixleng-2, 2);
    				mixChar.push(detach.charAt(0));
					mixChar.push(CPLX);
					recipe.complex = CPLX;

    			} else {
					mixChar.splice(mixleng-2, 2);
					mixChar.push(CPLX);
					recipe.complex = CPLX;

    			}
			}

    	} else if( JungUniCode(recipe.prev) > -1 && recipe.jong > -1 ) {  // 자음 모음 자음 조합.
			cho = ChoUniCode(mixChar[mixleng-3]);
			jung = JungUniCode(mixChar[mixleng-2]);

			if(!recipe.MixStr && cho > -1 ){
    			recipe.MixStr = CharMix(cho, jung);
    			mixChar.splice(mixleng-3, 3);
				mixChar.push(recipe.MixStr);
				mixChar.push(chars[i]);
			}

    		if( recipe.MixStr && cho === -1){
    			recipe.MixStr = '';
    		}

			cho = jung = -1;	
    		recipe.complex = ComplexChar(recipe.prev, chars[i]);

    	} else { // 종음 조합.

    		// 쌍음 초성.
    		if(ChoUniCode(recipe.complex) > -1 ){

    			if( recipe.MixStr) { 
    				jong = JongUniCode(recipe.prev);

    			} else if(JungUniCode(recipe.prev) > -1 ) {

    				cho = ChoUniCode(recipe.complex);
    				jung = JungUniCode(recipe.prev);

    				recipe.MixStr = CharMix(cho, jung);
	    			mixChar.splice(mixleng-3, 3);
					mixChar.push(recipe.MixStr);
					mixChar.push(chars[i]);
					recipe.complex = '';
					cho = jung = -1;
    			}

    		} else {

    			if(recipe.MixStr) {
    				jong = JongUniCode(mixChar[mixleng-2]);

    			}else if( JungUniCode(recipe.complex) > -1 &&  JungUniCode(chars[i]) > -1 ){
	    			cho = ChoUniCode(mixChar[mixleng-3]);
	    			jung = JungUniCode(recipe.complex);

	    			if(cho > -1){
	    				recipe.MixStr = CharMix(cho, jung);
		    			mixChar.splice(mixleng-3, 3);
	    				mixChar.push(recipe.MixStr);
	    				mixChar.push(chars[i]);
	    				recipe.complex = '';
    				}
    				cho = jung = -1;

    			} else if( JungUniCode(recipe.prev) > -1 && JungUniCode(chars[i]) > -1 ) { 
	    			cho = ChoUniCode(mixChar[mixleng-3]);
	    			jung = JungUniCode(recipe.prev);

	    			if(cho > -1){
		    			recipe.MixStr = CharMix(cho, jung);
		    			mixChar.splice(mixleng-3, 3);
						mixChar.push(recipe.MixStr);
						mixChar.push(chars[i]);
						recipe.complex = '';
	    				recipe.MixStr = '';
	    			}
					cho = jung = -1;
    			} else if( !recipe.MixStr && JongUniCode(recipe.complex) > 0 ){

    				var detach = COMPLEX[recipe.complex];
   					cho = ChoUniCode(detach.charAt(1));
   					jung = JungUniCode(chars[i]);

   					if(jung > -1){
	   					recipe.MixStr = CharMix(cho, jung);
	   					mixChar.splice(mixleng-2, 2);
	   					mixChar.push(detach.charAt(0));
	   					mixChar.push(recipe.MixStr);
   					}
 					
 					recipe.complex = '';
   					cho = jong = -1;

    			} else {
    				var pattern_check = pattern_kor.test(chars[i]);
    				if(!pattern_check){
    					// console.log('숫자 특수문자.');
		    			cho = ChoUniCode(mixChar[mixleng-3]);
		    			jung = recipe.complex ? JungUniCode(recipe.complex):JungUniCode(recipe.prev);
		    			recipe.MixStr = CharMix(cho, jung);

		    			if(cho > -1 && jung > -1){
			    			recipe.MixStr = CharMix(cho, jung);
			    			mixChar.splice(mixleng-3, 3);
							mixChar.push(recipe.MixStr);
							mixChar.push(chars[i]);
		    			}

		    			recipe.complex = '';
						recipe.MixStr = '';
						cho = jung = -1;
    				}
    			}
    		}

    		if( cho > -1 && jung > -1 ){
    			recipe.MixStr = CharMix(cho, jung);
    			mixChar.splice(mixleng-2, 2);
    			mixChar.push(recipe.MixStr);

    		} else if( jong > -1 ) {

    			if( JongUniCode(recipe.prev) > -1) {

    				var prevCPLX = mixChar[mixleng-2];;
    				if(!COMPLEX[prevCPLX]){

    					prevCPLX = mixChar[mixleng-3]
    					
    					if(JungUniCode(chars[i]) > -1 && COMPLEX[prevCPLX] ){
	    					var complete = String.fromCharCode( mixChar[mixleng-4].charCodeAt() +JongUniCode(mixChar[mixleng-3]));
	    					mixChar.splice(mixleng-4, 4);
		    				mixChar.push(complete);
		    				mixChar.push(recipe.prev);
		    				mixChar.push(chars[i]);
    					} else if( ChoUniCode(recipe.prev) > -1 && JungUniCode(chars[i]) > -1 ){
    						if(recipe.MixStr){
    							recipe.MixStr = '';
    						} 
    					}else {
    						if(JungUniCode(chars[i]) === -1 ){
			    				recipe.MixStr = String.fromCharCode(recipe.MixStr.charCodeAt()+jong);
				    			mixChar.splice(mixleng-3, 3);
			    				mixChar.push(recipe.MixStr);
			    				mixChar.push(chars[i]);
			    				recipe.MixStr = '';
			    			}
    					}

    				} else {

						if( JungUniCode(chars[i]) > -1 ){
							jong = COMPLEX[prevCPLX].charAt(0);
							cho = COMPLEX[prevCPLX].charAt(1); 

							var complete = String.fromCharCode( mixChar[mixleng-3].charCodeAt() +JongUniCode(jong));
							mixChar.splice(mixleng-3, 3);
		    				mixChar.push(complete);
		    				mixChar.push(cho);
						} else {					
	    					var complete = String.fromCharCode( mixChar[mixleng-3].charCodeAt() +JongUniCode(mixChar[mixleng-2]));
	    					mixChar.splice(mixleng-3, 3);
		    				mixChar.push(complete);
						}
						mixChar.push(chars[i]);
		    			recipe.MixStr = '';

    				}

    				recipe.complex = '';

    			} else {
	    			cho = ChoUniCode(recipe.prev);
	    			jung = JungUniCode(chars[i]);
	    			var complete = String.fromCharCode(recipe.MixStr.charCodeAt()+jong);
	    			recipe.MixStr = CharMix(cho, jung);
	    			
	    			// 관련된 글자를 모두 제거한다.
	    			mixChar.splice(mixleng-3, 3);
	    			mixChar.push(complete);
	    			mixChar.push(recipe.MixStr);

    			}
    		} 
    	}

    	cho = jung = jong = -1;
    	recipe.prev = chars[i];
	}

    // 최종값의 조합 확인. 조합 확인 처리하기.
    mixleng = mixChar.length;

    var lastprev = mixChar[mixleng-2];
    var last = mixChar[mixleng-1];

    if(ChoUniCode(lastprev) > -1 && JungUniCode(last) > -1 ){
    	var complete = CharMix(ChoUniCode(lastprev), JungUniCode(last));
    	mixChar.splice(mixleng-2, 2);
		mixChar.push(complete);
    } else if(recipe.MixStr && JongUniCode(last) > -1 ){
    	var complete = String.fromCharCode(recipe.MixStr.charCodeAt()+JongUniCode(last));
    	mixChar.splice(mixleng-2, 2);
		mixChar.push(complete);
    }

 	return mixChar;
}


// String.fromCharCode(44032 + (cho * 588) + (jung * 28) + jong;

function ChoUniCode(str){
	var unicodes = cCho.indexOf(str);   
	return unicodes;
}

function JungUniCode(str){ 
	var unicodes = cJung.indexOf(str); 
	return unicodes; 			
}

function JongUniCode(str){
	var unicodes = cJong.indexOf(str);
	return unicodes;
}

// 합성문자 유니코드 
function ComplexUniCode(str){
	var unicodes = ChoUniCode(str);
	unicodes = 
		ChoUniCode(str) > -1 ? ChoUniCode(str):
		JungUniCode(str) > -1 ? JungUniCode(str):
		JongUniCode(str);
	return unicodes;
}

// 합성 문자열 생성
function ComplexChar(str1, str2){
	var complexer = '';
	for(key in COMPLEX){
		complexer = COMPLEX[key] === str1+str2 ? key:complexer;
	}
	return complexer;
}

//문자열 조합.
function CharMix(cho, jung, jong){
	if(!jong) { jong = 0; }
	var char = String.fromCharCode(44032 + (cho * 588) + (jung * 28) + jong);
	return char;
}


//문자열 byte 계산
/*참고 https://programmingsummaries.tistory.com/239*/
function getByteLength(s,b,i,c){
    for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
    return b;
}


// 문자열 분리
function StringDetach(str){

	var cnt = str.length,
        chars = [],
        cCode,
        cho, jung, jong;;

    for (var i = 0; i < cnt; i++) {
        cCode = str.charCodeAt(i);

		if (cCode == 32) { continue; } 

        if ( cCode < 0xAC00 || cCode > 0xD7A3 ) { // 한글이 아니거나 1글자일 경우
            chars.push(str.charAt(i));
            continue;
        }
        cCode  = str.charCodeAt(i) - 0xAC00;

        jong = cCode % 28; // 종성
        jung = ((cCode - jong) / 28 ) % 21 // 중성
        cho  = (((cCode - jong) / 28 ) - jung ) / 21 // 초성

        chars.push(cCho[cho], cJung[jung]);
		if (cJong[jong] !== '') { chars.push(cJong[jong]); }
    }

    return chars;
}



// 모스부호 인코딩
function MS_EnCoder(chars){

	let MS_CODE = '';

	for(var i = 0; i < chars.length; i++){

		var type = pattern_kor.test(chars[i]) ? 'KR':pattern_eng.test(chars[i]) ? 'EN':pattern_num.test(chars[i]) ? 'NUM':'SPChar'; // 번역 언어설정 

		var Split_str = chars[i].toUpperCase(); // 영어는 대문자로 전환
		var Morse_Code = CodeType[type][Split_str]; 

		if(Morse_Code){

			for(var j = 0; j < Morse_Code.length; j++){
				MS_CODE += Morse_Code.charAt(j) === '0' ? '· ':'– '; //모스코드 변환 영문.숫자.한글
			}
			MS_CODE += '　';

		} else if(COMPLEX[Split_str]){ // 특수문자 처리 

			for(var j = 0; j < COMPLEX[Split_str].length; j++){
				var COMPLEX_str = COMPLEX[Split_str][j];
				Morse_Code = CodeType[type][COMPLEX_str];

				for(var g = 0; g < Morse_Code.length; g++){
					MS_CODE += Morse_Code.charAt(g) === '0' ? '· ':'– '; //모스코드 변환
				}

				MS_CODE += '　';
			}

		} else { // 지원하지 않는 문자.
			MS_CODE += chars[i]+' 　';
			modal_Case('close', 'fail');
			modal_open('" '+chars[i]+' " 는 인식할 수 없는 문자 입니다.');
		}
	}

	return MS_CODE;
}



// 모스부호 디코딩
function MS_DeCoder(type, str){
	// 각 모스부호 한글 변환
	var cnt = str.length,
		cCode = '',
		convert = [],
		CodeArr = []; 

	CodeArr = str.split('　');

	for(var i = 0; i < CodeArr.length; i++){
		var morseCode = CodeArr[i];

		for(var j = 0; j < morseCode.length; j++){
			var split = morseCode.charAt(j);
		 	var morseNum = split === '·' ? '0':split === '–' ? '1':split;
			cCode += morseNum;
		}

		var decode = lnagsConver(type, cCode);
		convert.push(decode);
		cCode = '';
	}


    return convert;
}


// 모스부호 언어 변경
function lnagsConver(type, str){
    var MS_KEY = '';

    if(!CodeType[type]){
    	modal_Case('close', 'warning');
		modal_open('준비중입니다.');
		return '';
    }

    // 선택 언어
    for (var key in CodeType[type]) {
    	if(CodeType[type][key] === str){ 
    		MS_KEY = key;
    		continue;
    	} else {

		    /* 복합 문자 + 숫자 + 특수문자*/
		    // 숫자 
			for (var key in CodeType['NUM']) {
				if(CodeType['NUM'][key] === str){
		    		MS_KEY = key;
		    		continue;
		    	}
			}

			// 특수문자
			for (var key in CodeType['SPChar']) {
				if(CodeType['SPChar'][key] === str){
		    		MS_KEY = key;
		    		continue;
		    	} else {

		    	}
			}
    	}

    	if(!MS_KEY){ MS_KEY= str; }
    }

    return MS_KEY;
}