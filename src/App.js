// App.jsx / App.tsx

import React, {Component} from 'react';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './App.css'

class App extends Component {


    // state = {
    //     kor: "KOREAN",
    //     vie: "VIETNAMESE",
    //     result: "",
    //     btnText: 'Copy'
    // }


    state = {
        kor: "<p>좌하 반투명 지도&nbsp;cg</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>완도군 노화읍 복고리 해상</p><p>&nbsp;</p><p>&nbsp;</p><p>신광하 기자</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>좌하 반투명&nbsp;cg</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>◀ＩＮＴ▶&nbsp;정진수 완도군 노화읍 복고리&nbsp;</p><p>올해 유독 더&nbsp;(전복)출하량이 감소되고&nbsp;</p><p>어민들이 아주 시름이 좀 높습니다. &nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>전복 소비부진 청년 어민 파산위기 내몰려</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>◀ＩＮＴ▶&nbsp;김준혁 완도군 노화읍장</p><p>(귀어한 뒤)&nbsp;빚으로&nbsp;(전복양식업을)했던 분들은&nbsp;</p><p>뭐 원금하고 이자하고 같이 나가야 되는&nbsp;</p><p>그런 지금 시기가 도래해서 그런 부분이 있다&nbsp;</p><p>보니까,&nbsp;</p><p>좀 더 힘들어진 거 같고..</p><p>&nbsp;</p><p>영상취재 조성택</p><p>cg &nbsp;이희정</p>",
        vie: "<p>좌하 반투명 지도&nbsp;cg</p><p>Bokgo-ri, Nohwa-eup, Wando-gun</p><p>Phóng viên Shin Kwangha</p><p>좌하 반투명&nbsp;cg</p><p>◀ＩＮＴ▶ Jung Jinsoo, Bokgori, Nohwa-eup, Wando-gun</p><p>Năm nay, các chuyến hàng (bào ngư) giảm, ngư dân rất lo lắng.</p><p>Ngư dân trẻ phá sản vì bào ngư ế ẩm</p><p>◀ＩＮＴ▶ Kim Joonhyuk, Thị trưởng Nohwa-eup, Wando-gun</p><p>Những người đã (nuôi bào ngư) đã mắc nợ (sau khi quay trở lại với như nghiệp) nay lại phải trả gốc và lãi cùng lúc nên dẫn đến thời ký như vậy. Tình hình hiện tại càng trở nên khó khăn hơn.</p><p>Phóng viên hiện trường Cho Sungtaek</p><p>cg Lee Heejung</p>",
        result: "",
        btnText: 'Copy'
    }

    mergeRight = () => {
        const blankRow = "<p>&nbsp;</p>"
        let kor = this.state.kor
        let vie = this.state.vie.replaceAll(blankRow, "")

        let korList = this.split(kor)
        let vieList = this.split(vie)

        let result = [];

        let i = 0;
        let j = 0;

        while (i < korList.length && j < vieList.length) {
            while (korList[i] === blankRow) {
                result.push(korList[i])
                i++;
            }
            while (vieList[j] === blankRow) {
                result.push(vieList[j])
                j++;
            }
            result.push(korList[i].replace('<p>', '<p class="kor">'))
            result.push(vieList[j].replace('<p>', '<p class="vie">'))
            i++;
            j++;
        }

        console.log(result)

        this.setState({
            kor: this.state.kor,
            vie: this.state.vie,
            result: result.join("")
        })

        const element = document.getElementById("result");
        element.scrollIntoView()

        // this.copyTextWithStyles(element)
    }

    mergeLeft = () => {
        const blankRow = "<p>&nbsp;</p>"
        let kor = this.state.kor
        let vie = this.state.vie.replaceAll(blankRow, "")

        let korList = this.split(kor)
        let vieList = this.split(vie)

        console.log(korList)
        console.log(vieList)
    }


    split = (src) => {
        return src.replaceAll("</p><p>", "</p>###SPLIT###<p>").split("###SPLIT###");
    }

    clear = () => {
        this.setState({
            kor: "KOREAN",
            vie: "VIETNAMESE",
            result: ""
        })
    }
    copyTextWithStyles = (element) => {

        let doc = document
            , text = doc.getElementById('result')
            , range, selection;

        if (doc.body.createTextRange) {
            range = doc.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = doc.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);

        }
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        this.setState({
            btnText: 'Copied'
        })
    }


    render() {
        return (
            <div className="App">
                <div className={"div1"}>
                    {/*<button onClick={this.mergeLeft}>Merge Left Column</button>*/}
                    <button onClick={this.mergeRight}>Merge</button>
                    <button onClick={this.clear}>Clear</button>
                    <button onClick={this.copyTextWithStyles}
                            disabled={this.state.result.length === 0}>{this.state.btnText}</button>
                </div>
                <div className="div2">
                    <div className="div3">
                        <CKEditor
                            editor={ClassicEditor}
                            data={this.state.kor}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                this.setState({
                                    kor: data,
                                    vie: this.state.vie,
                                    result: "",
                                    btnText: "Copy"
                                })
                            }}
                            config={{
                                copyFormatting_allowedContexts: true,
                                // toolbar: [  'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'clipboard', 'table']
                            }}
                        />
                    </div>
                    <div className="div3">
                        <CKEditor
                            editor={ClassicEditor}
                            data={this.state.vie}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                this.setState({
                                    kor: this.state.kor,
                                    vie: data,
                                    result: "",
                                    btnText: "Copy"
                                })
                            }}
                            config={{
                                copyFormatting_allowedContexts: true,
                                // toolbar: [  'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'clipboard', 'table']
                            }}
                        />
                    </div>

                </div>

                <div dangerouslySetInnerHTML={{__html: this.state.result}} id={"result"}/>


            </div>
        );
    }
}

export default App;
