<?php
namespace App\Http\Traits;


trait FileTraits
{
    public function uploadFile($file, $path)
    {
        $fileName = time().$file->getClientOriginalName();
        $file->move($path, $fileName);
        return url($path . $fileName);   
    }

}