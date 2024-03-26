// App.jsx / App.tsx

import React, {Component} from 'react';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './App.css'
import {Button, Drawer, Collapse, Card, Flex} from 'antd';
import {RollbackOutlined} from "@ant-design/icons";


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
        btnText: 'Copy',
        isHistoriesOpen: false,
        histories: []
    }

    items = [
        {
            key: '1',
            label: 'This is panel header 1',
            children: <p>a</p>,
        },
        {
            key: '2',
            label: 'This is panel header 2',
            children: <p>s</p>,
        },
        {
            key: '3',
            label: 'This is panel header 3',
            children: <p>v</p>,
        },
    ];


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

        this.saveInLocalStorage(this.state.vie, this.state.kor, result.join(""))

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

    saveInLocalStorage (vi, ko, result) {
        let his = this.getLocalStorage()

        his.unshift ({
            expiredIn: new Date().getTime() + 86400000,
            createTime: new Date(),
            data: {
                vi : vi,
                ko : ko,
                result : result
            }
        })

        localStorage.setItem("histories", JSON.stringify(his))
    }

    getLocalStorage () {
        const now = new Date().getTime();
        let his = JSON.parse(localStorage.getItem("histories")) || []

        his = his.filter(v => v.expiredIn >= now)

        return his
    }

    revertVersion = (data) => {
        this.setState({
            kor: data.ko,
            vie: data.vi,
        })
        this.closeHistories()
    }

    openHistories = () => {
        let his =this.getLocalStorage()
        let data = his.map((v, i) => {
            return {
                key: i,
                label: new Date(v.createTime).toLocaleString(),
                children: <div>
                <Flex justify={'flex-end'}>
                    <Button className={"revert-btn"} type="primary" shape="round" icon={<RollbackOutlined />} onClick={() => this.revertVersion(v.data)}>Revert</Button>
                </Flex>
                    <br/>
                <Flex vertical={false} justify={'space-between'} gap={10} className={"histories-group"}>

                    <Card>
                        <div dangerouslySetInnerHTML={{__html: v.data.ko}}/>
                    </Card>
                    <Card>
                        <div dangerouslySetInnerHTML={{__html: v.data.result}}/>
                    </Card>
                    <Card>
                        <div dangerouslySetInnerHTML={{__html: v.data.vi}}/>
                    </Card>
                </Flex>
                </div>
            }
        })

        console.log(his)

        this.setState({
            isHistoriesOpen: true,
            histories: data
        })
    }

    closeHistories = () => {
        this.setState({
            isHistoriesOpen: false
        })
    }


    render() {
        return (
            <div className="App">
                <div className={"div1"}>
                    {/*<button onClick={this.mergeLeft}>Merge Left Column</button>*/}
                    <button onClick={this.mergeRight} className={"btn green-btn"}
                            disabled={this.state.kor.length === 0 || this.state.vie.length === 0}
                    >Merge</button>
                    <button onClick={this.copyTextWithStyles}  className={"btn red-btn"}
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
                <div className="div2" id={"result"}>

                { this.state.result.length > 0 ?

                        <Card>
                            <div dangerouslySetInnerHTML={{__html: this.state.result}} />
                        </Card>

                    :
                    <></>
                }
                </div>

                <button className={"btn histories-btn float_right_bottom_btn"} onClick={this.openHistories}>Histories</button>
                <Drawer
                    title="Histories"
                    placement="bottom"
                    maskClosable={true}
                    closeIcon={false}
                    onClose={this.closeHistories}
                    open={this.state.isHistoriesOpen}
                    height={'90vh'}
                    key={"bottom"}
                >
                    <Collapse accordion  items={this.state.histories} defaultActiveKey={[0]}  />
                </Drawer>

            </div>
        );
    }
}

export default App;
