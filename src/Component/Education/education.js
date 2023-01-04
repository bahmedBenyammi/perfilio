
import './education.css'
import {Component, useEffect, useState} from "react";
import {collection, getDocs, limit, orderBy, query, startAfter} from "firebase/firestore";
import {db} from "../firebase";
import {TfiReload} from "react-icons/tfi";
import {FaRegArrowAltCircleDown} from "react-icons/fa";

const Degrees=[{
    title:"Master of software engineering",
    date:"07/2022",
    organization:"university of constantine 2 Abdelhamid Mehri",
},
    {
        title:"Bachelor of software engineering",
        date:"09/2019",
        organization:"university of constantine 2 Abdelhamid Mehri",
    }]
export default class Education extends Component{
    constructor(props) {
        super(props);
        this.state={
            status:"wait",
            Certificate:[],
            spin:false,
            total:0,
            ref:props.re
        }
    }
    componentDidMount() {
        this.countCertificate()
        this.getCertificate()
    }
    countCertificate=async ()=>{
        let CertificateCollection=collection(db,"Certificates")
        let c=(await getDocs(CertificateCollection)).size
        this.setState({total:c})
    }

    getCertificate=async ()=>{
        let Certificates=this.state.Certificate
        let CertificateCollection=collection(db,"Certificates")
        let q

        if (Certificates.length===0)
            q=query(CertificateCollection,orderBy("date","desc"),limit(2))
        else
            q=query(CertificateCollection,orderBy("date","desc"),startAfter(Certificates[Certificates.length-1].date),limit(2))

        getDocs(q).then(doc=>{

            let p= doc.docs.map(pr=>{

                return pr.data()})
            this.setState({Certificate:[...Certificates,...p],status:""})
        })

    }
    loadMore=()=>{
        this.getCertificate()
        this.setState({ spin:true})
    }

    render(){
        const {Certificate,status,spin,total}=this.state;
    return  (<div className="section" ref={this.state.ref}>
        <div>
            <p className="section_title">My Degrees </p>
        </div>
        <div className="containerEduction">
            { Degrees.map(d=>{
                return <Certaficat certaficat={d}/>
            })}
        </div>
        <div>
            <p className="section_title">My certificates</p>
        </div>
        <div className="containerEduction">
            {status!=="wait"&&Certificate.map((p)=>{
                return <Certaficat certaficat={p} key={p.title}></Certaficat>
            })}
           </div>
        {total>Certificate.length&& <div className="flex load">
            <div onClick={this.loadMore} className="loadMore">
                <p>Load more</p>
                {spin ?
                    <TfiReload className={"loadicon spin"} />: <FaRegArrowAltCircleDown className={"loadicon"} />}</div>

        </div>}
    </div>)}
}
function Certaficat({certaficat}){
    const [state,setState]=useState(certaficat);

    useEffect(()=>{
        setState(certaficat)
    },[certaficat])
  return<div className="certaficat">
            <p className='certaficat-title'>{certaficat.title}</p>
            <p className="certaficat-date">{certaficat.date}</p>
            <p className="organisation">{certaficat.organization}</p>
      {certaficat.link!==undefined&&<p className="certaficat-link">
          View</p>}
      {certaficat.link===undefined&&<><div className="sticker">
          <div className="triangle"></div>
      </div>
      <div className="sticker">
          <div className="smallTriangle"></div>
      </div></>}
        </div>
}
