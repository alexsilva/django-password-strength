from django import forms

from django_password_strength.validators import PolicyMinLengthValidator
from django_password_strength.widgets import PasswordStrengthInput, PasswordConfirmationInput


class PasswordField(forms.CharField):
    """Password field"""

    widget = PasswordStrengthInput

    def __init__(self,
                 max_length=None,
                 min_length=None,
                 strip=True,
                 *args, **kwargs):
        super(PasswordField, self).__init__(max_length=max_length,
                                            min_length=None,
                                            strip=strip,
                                            *args, **kwargs)
        self.min_length = min_length

        if min_length is not None:
            self.validators.append(PolicyMinLengthValidator(int(min_length)))


class PasswordConfirmationField(forms.CharField):
    """Password confirmation field"""

    widget = PasswordConfirmationInput

    def __init__(self, confirm_with=None, *args, **kwargs):
        self.confirm_with = confirm_with
        super(PasswordConfirmationField, self).__init__(*args, **kwargs)

    def widget_attrs(self, widget):
        attrs = super(PasswordConfirmationField, self).widget_attrs(widget)
        if self.confirm_with is not None:
            attrs['data-confirm-with'] = 'id_%s' % self.confirm_with
        return attrs
