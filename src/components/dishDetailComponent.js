import React,{Component} from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle,Breadcrumb,BreadcrumbItem,Modal ,ModalHeader, Label,Row,Col,Button} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control,LocalForm,Errors} from 'react-redux-form';
import {Loading} from './loadingComponent';
import {baseUrl} from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger} from 'react-animation-components'

const required =(val)=>val && val.length;

const maxLength =(len)=>(val)=>!(val)||(val.length<=len);

const minLength=(len)=>(val)=>(val) && (val.length>=len);


    function RenderDish({dish}){
        return(
            <FadeTransform in  
             transformProps={{
          exitTransform:'scale(0.5) translateY(-50%)' }}>
            <Card>
                <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
            </FadeTransform>
        );
    }

   function RenderComments({comments,postComment,dishId}){
        if(comments != null){
            const dishComments = comments.map((comment) =>{
                return(
                    <ul key={comment.id} className="list-unstyled">
                        <Stagger in >
                            <Fade in  >
                                <li>{comment.comment}</li>
                                <li>-- {comment.author}, {new Intl.DateTimeFormat('en-US', 
                                                        { year: 'numeric', month: 'short', day: '2-digit'})
                                                        .format(new Date(Date.parse(comment.date)))}</li>
                            </Fade>
                        </Stagger>
                    </ul>
                );
            });
            return(
                <div>
                    <h4>Comments</h4>
                    <div>{dishComments}</div>
                    <CommentForm dishId={dishId} postComment={postComment}/>
                </div>
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }
    class CommentForm extends Component{
        constructor(props){
            super(props);
            this.state={
                isModalOpen:false
            };
            this.toggleModal=this.toggleModal.bind(this);
        };

        toggleModal(){
            this.setState({
                isModalOpen:!this.state.isModalOpen
            });
        }
        handleSubmit(values){
            this.toggleModal();
           this.props.postComment(this.props.dishId,values.Rating,values.name,values.message)
        }

        render(){
            return(
                <>
                <button className='btn btn-light' onClick={this.toggleModal}>
                     <i class="fas fa-pencil-alt"></i> 
                       Submit Comment
                </button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <LocalForm onSubmit={(values)=>this.handleSubmit(values)}>
                        <div className='row'>
                            <div className="offset-10 col-1">
                                <button type='button' onClick={this.toggleModal} className="btn btn-light">
                                    <i class="fas fa-times-circle"></i> 
                                </button>
                            </div>
                        </div>
                       <ModalHeader>Submit Comment
                            
                        </ModalHeader>
                        <Row className='form-group m-auto ' >
                            <Col md={8}>
                                <Label htmlFor="Rating">Rating</Label>
                                <Control.select model='.Rating' id="Rating" name="Rating" className='form-control'>
                                    <option active>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                            </Col>
                        </Row>
                        <Row className='form-group mx-auto mb-4' >
                            <Col md={8}>
                                <Label htmlFor="name">Your Name</Label>
                                <Control.text model='.name' id="name" name="name" className='form-control'
                                 validators={{
                                    required,minLength:minLength(3),
                                    maxLength:maxLength(15)
                                }}/>
                                 <Errors
                                    className='text-danger'  model='.name'
                                    show='touched'
                                    messages={{
                                        required:'Required -',
                                        minLength:'Must be Greater than three characters',
                                        maxLength:'Must be lesser than 16 characters'
                                    }}
                                   />   
                                
                            </Col>
                        </Row>
                        <Row className='form-group mx-auto mb-4'>
                            <Col md={8}>
                            <Label htmlFor="message">Your Feedback</Label>

                                <Control.textarea model=".message" id='message' name='message'
                                   rows='6'
                                   className='form-control'
                                   validators={{
                                    required
                                }}/>
                                  <Errors
                                    className='text-danger'  model='.message'
                                    show='touched'
                                    messages={{
                                        required:'Required ',
                                    
                                    }}/>
                            </Col>
                        </Row>
                        <button className="btn btn-primary ml-2 mb-3" type='submit'>Submit</button>
                    </LocalForm>
                </Modal>
                </>
            );

        }
        
    }

    const Dishdetail=(props)=>{
        if(props.isLoading){
            return(
                <div className='container'>
                    <div className='row'>
                        <Loading />
                    </div>
                </div>
            )

        }
        else if(props.errMess){
            return(
                <div className='container'>
                    <div className='row'>
                     <h4>{props.errMess}</h4>
                    </div>
                </div>
            )
        }

        else if(props.dish != null) {
        return (
            <div className="container">
                <div className='row'>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <Link to='/menu'>Menu</Link> 
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            {props.dish.name}
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish}/>
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments}
                        postComment={props.postComment}
                        dishId={props.dish.id}/>
                        
                    </div>
                </div>
            </div>
        );
        }
        else{
        return(
            <div></div>
        );
        }
    }

 
export default Dishdetail;