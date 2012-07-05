from Products.CMFPlone.interfaces import INonInstallable as INonInstallableProfiles
from zope.interface import implements


class HiddenProfiles(object):
    implements(INonInstallableProfiles)

    def getNonInstallableProfiles(self):
        return ['collective.js.lightbox2:uninstall',
                ]