import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Post } from '../post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Posts');
  }

  ngOnInit() {
    const obj$ = this.http.get('http://jsonplaceholder.typicode.com/posts');
    obj$.subscribe({
      next: (response: any[]) => {
        // console.log(response);
        this.posts = response.slice(0,5).map((res)=>{
          return new Post(res.id, res.title, res.body);
        });
        console.log(this.posts);
        
      }
    })
    this.form = this.fb.group({
      id: [''],
      title: [''],
      body: ['']
    })
  }

  onSubmit(form: FormGroup){
    const value = form.value;
    if(value.id){
      //Update
      const obj$ = this.http.put('http://jsonplaceholder.typicode.com/posts/' + value.id, value);
      obj$.subscribe({
        next: (response: any)=>{
          const post = new Post(response.id, response.title, response.body);
          const index = this.posts.findIndex((p)=> p.id === post.id);
          this.posts[index] = post;
          

          
        }
      })

    }else{
      //Create
      const obj$ = this.http.post('http://jsonplaceholder.typicode.com/posts', value);
          obj$.subscribe({
            next: (response: any) => {
              console.log(response);
              const post = new Post(response.id, response.title, response.body);
              // this.posts = [post, ...this.posts];
              this.posts.unshift(post);
              this.form.reset();
            }
        })
    }
    

  }

  onClick(post: Post){
    this.form.patchValue({
      id: post.id,
      title: post.title,
      body: post.body
    })
  }

  onDelete(post: Post){
    const con = confirm('Are you sure?');
    if(con){
      const obj$ = this.http.delete('http://jsonplaceholder.typicode.com/posts/'+ post.id);
      obj$.subscribe({
        next: (response: any) => {
          const index = this.posts.findIndex((p)=> p.id === post.id);
          // this.posts.splice(index , 1);
          this.posts = this.posts.filter(p=> p.id !== post.id);
        }
      })
    }else{

    }
  }
  

}
