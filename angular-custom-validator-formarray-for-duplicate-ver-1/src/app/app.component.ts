import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray, ValidatorFn, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formArray = new FormArray(
    [
      this.createGroup({ name: 'abc', content: '' }),
      this.createGroup({ name: 'abc', content: '' }),
      this.createGroup({ name: 'bcd', content: '' }),
      this.createGroup({ name: 'bcd', content: '' }),
      this.createGroup({ name: '', content: '' })
    ],
    this.hasDuplicate('name')
  );

  createGroup(data: any) {
    data = data || { name: null, content: null };
    return new FormGroup({
      name: new FormControl(data.name),
      content: new FormControl(data.content)
    });
  }

  duplicates = [];

  hasDuplicate(key_form): ValidatorFn {
    return (formArray: FormArray): { [key: string]: any } | null => {
      if (this.duplicates) {
        for (var i = 0; i < this.duplicates.length; i++) {
          let errors = this.formArray.at(this.duplicates[i]).get(key_form).errors as Object || {};
          delete errors['duplicated'];
          this.formArray.at(this.duplicates[i]).get(key_form).setErrors(errors as ValidationErrors);
        }
      }

      let dict = {};
      formArray.value.forEach((item, index) => {
        dict[item.name] = dict[item.name] || [];
        dict[item.name].push(index);
      });
      let duplicates = [];
      for (var key in dict) {
        if (dict[key].length > 1) duplicates = duplicates.concat(dict[key]);
      }
      this.duplicates = duplicates;

      for (const index of duplicates) {
        formArray.at(+index).get(key_form).setErrors({ duplicated: true });
      }

      return duplicates.length > 0 ? { error: 'Has Duplicate !!!' } : null;
    };
  }
}
