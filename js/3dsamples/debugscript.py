import Rhino
doc = Rhino.RhinoDoc.ActiveDoc
layers = Rhino.RhinoDoc.ActiveDoc.Layers

for i in layers:
    print(i.Name)
    print(i.Index)
    
for rObj in doc.Objects:
    print(rObj.Attributes.LayerIndex)