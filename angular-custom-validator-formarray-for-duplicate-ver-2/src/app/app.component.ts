import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  formArray = new FormArray([
    this.createGroup({ name: 'abc1', content: '' }),
    this.createGroup({ name: 'abc1', content: '' }),
    this.createGroup({ name: 'bcd3', content: '' }),
    this.createGroup({ name: 'bcd4', content: '' }),
    this.createGroup({ name: '', content: '' })
  ]);

  createGroup(data: any) {
    data = data || { name: null, content: null };
    return new FormGroup({
      name: new FormControl(data.name),
      content: new FormControl(data.content)
    });
  }

  duplicates = [];

  ngOnInit() {
    setTimeout(() => {
      this.checkDuplicates('name');
    });
    this.formArray.valueChanges.subscribe(x => {
      this.checkDuplicates('name');
    });
  }

  checkDuplicates(key_form) {
    console.log(this.formArray)
    // for (const index of this.duplicates) {
    //   let errors = this.formArray.at(index).get(key_form).errors as Object || {};     
    //   delete errors['duplicated'];
    //   this.formArray.at(index).get(key_form).setErrors(errors as ValidationErrors);
    // }
    this.duplicates = [];

    let dict = {};
    this.formArray.value.forEach((item, index) => {
      dict[item.name] = dict[item.name] || [];
      dict[item.name].push(index);
    });
    
    for (var key in dict) {
      if (dict[key].length > 1)
        this.duplicates = this.duplicates.concat(dict[key]);
    }
    
    for (const index of this.duplicates) {
      this.formArray.at(index).get(key_form).setErrors({ duplicated: true });
    }
    console.log(this.formArray)
  }
}
