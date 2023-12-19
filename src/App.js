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
        kor: "",
        vie: "",
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
                                console.log(data)
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
