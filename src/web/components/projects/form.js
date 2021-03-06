var Form = require('../../form');

var Vue = require('vue');

module.exports = ProjectForm;


function ProjectForm(values) {
    if (!values) {
        values = {
            url: ''
        };
    }

    var schema = {
        url: {
            title: 'Url',
            type: 'String',
            view: 'Input',
            validate: [],
            required: true
        }
    };

    var formFactory = new Form.Factory(schema, values);

    var form = new Form.Form(null, require('./templates/form.html'));

    var fields = formFactory.getFields();

    form.setFields(fields);
    form.setComponents(formFactory.getComponents());

    form.setFormData({
        valid: false,
        result: null
    });

    form.addMethods({
        save: function () {

            this.clearErrors();

            this.validate(function (err, valid) {

                if (valid) {
                    var that = this;

                    this.$parent.getLocationsApi().create(this.getValue(), function(err, data) {

                        if (err) {
                            if (err.status
                                && err.response
                                && err.response.body
                                && err.response.body.list
                            ) {
                                err.response.body.list.forEach(function(item) {
                                    that.errors.push(item.message);
                                });
                            } else {
                                console.log(err);
                            }

                            return;
                        }

                        that.$parent.addLocation(data.result);
                        that.clear();
                        that.$parent.hideAddForm();
                    });
                }
            });
        },

        cancel: function () {
            this.clear();
            this.clearErrors();

            this.$parent.hideAddForm();
        }

    });

    return form;
}



