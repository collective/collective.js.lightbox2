from setuptools import setup, find_packages


version = '0.0.2'


setup(name='collective.js.lightbox2',
      version=version,
      description=("An add-on product for Plone to provide Lightbox2."),
      long_description='\n\n'.join(
                            [open(filename).read() for filename in
                             ('README.rst',
                              'HISTORY.rst')
                            ]),
      # Get more strings from
      # http://pypi.python.org/pypi?%3Aaction=list_classifiers
      classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        ],
      keywords='',
      author='Netsight Internet Solutions Limited',
      author_email='support@netsight.co.uk',
      url='http://www.netsight.co.uk/',
      license='Creative Commons 2.5 Attribution (CC-BY-2.5)',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['collective', 'collective.js'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          'Products.CMFPlone',
          'collective.js.jqueryui',
      ],
      entry_points="""
      # -*- Entry points: -*-

      [z3c.autoinclude.plugin]
      target = plone
      """,
      setup_requires=[],
      )
