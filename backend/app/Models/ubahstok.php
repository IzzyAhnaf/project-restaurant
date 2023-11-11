<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ubahstok extends Model
{
    use HasFactory;
    protected $table = 'merubahstok';
    protected $fillable = [
        'idmenu', 'qty', 'updated_at', 'created_at'
    ];


    
}
